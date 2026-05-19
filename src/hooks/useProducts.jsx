import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { demoProducts } from '../data/demoProducts.js';
import { useAuth } from './useAuth.jsx';
import { createId, readStorage, STORAGE_KEYS, writeStorage } from '../utils/storage.js';

const ProductContext = createContext(null);
const headphonesReplacement = demoProducts.find((product) => product.name === 'Orion S9');

function attachUser(product, userId) {
  return {
    ...product,
    id: createId('product'),
    userId,
  };
}

export function ProductProvider({ children }) {
  const { currentUser } = useAuth();
  const [allProducts, setAllProducts] = useState(() => readStorage(STORAGE_KEYS.products, []));
  const [seededUsers, setSeededUsers] = useState(() => readStorage(STORAGE_KEYS.seededUsers, []));
  const [compareIds, setCompareIds] = useState([]);

  function persist(nextProducts) {
    setAllProducts(nextProducts);
    writeStorage(STORAGE_KEYS.products, nextProducts);
  }

  useEffect(() => {
    if (!currentUser) {
      setCompareIds([]);
      return;
    }

    const alreadySeeded = seededUsers.includes(currentUser.id);
    if (!alreadySeeded) {
      persist([...allProducts, ...demoProducts.map((product) => attachUser(product, currentUser.id))]);
      const nextSeededUsers = [...seededUsers, currentUser.id];
      setSeededUsers(nextSeededUsers);
      writeStorage(STORAGE_KEYS.seededUsers, nextSeededUsers);
      return;
    }

    const fixedUserProducts = demoProducts.map((demoProduct) => {
      const existingProduct = allProducts.find((product) => (
        product.userId === currentUser.id
        && (
          product.name === demoProduct.name
          || (product.name === 'SoundPro ANC' && demoProduct.name === headphonesReplacement?.name)
        )
      ));

      return {
        ...demoProduct,
        id: existingProduct?.id || createId('product'),
        userId: currentUser.id,
      };
    });

    const nextProducts = [
      ...allProducts.filter((product) => product.userId !== currentUser.id),
      ...fixedUserProducts,
    ];

    if (JSON.stringify(nextProducts) !== JSON.stringify(allProducts)) {
      persist(nextProducts);
    }
  }, [currentUser, seededUsers, allProducts]);

  const userProducts = useMemo(() => {
    if (!currentUser) {
      return [];
    }

    return allProducts.filter((product) => product.userId === currentUser.id);
  }, [allProducts, currentUser]);

  useEffect(() => {
    const availableIds = new Set(userProducts.map((product) => product.id));
    setCompareIds((ids) => ids.filter((id) => availableIds.has(id)));
  }, [userProducts]);

  function toggleCompare(id) {
    setCompareIds((ids) => {
      if (ids.includes(id)) {
        return ids.filter((itemId) => itemId !== id);
      }
      if (ids.length >= 3) {
        return ids;
      }
      return [...ids, id];
    });
  }

  function clearCompare() {
    setCompareIds([]);
  }

  const compareProducts = userProducts.filter((product) => compareIds.includes(product.id));

  const value = useMemo(() => ({
    products: userProducts,
    compareIds,
    compareProducts,
    toggleCompare,
    clearCompare,
  }), [userProducts, compareIds, compareProducts]);

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used inside ProductProvider');
  }
  return context;
}
