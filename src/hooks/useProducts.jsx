import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { demoProductImages, demoProducts } from '../data/demoProducts.js';
import { useAuth } from './useAuth.jsx';
import { createId, readStorage, STORAGE_KEYS, writeStorage } from '../utils/storage.js';

const ProductContext = createContext(null);

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

    const nextProducts = allProducts.map((product) => {
      const demoImage = demoProductImages[product.name];
      if (product.userId === currentUser.id && !product.image && demoImage) {
        return { ...product, image: demoImage };
      }
      return product;
    });

    if (nextProducts.some((product, index) => product !== allProducts[index])) {
      persist(nextProducts);
    }
  }, [currentUser, seededUsers, allProducts]);

  const userProducts = useMemo(() => {
    if (!currentUser) {
      return [];
    }

    return allProducts.filter((product) => product.userId === currentUser.id);
  }, [allProducts, currentUser]);

  function addProduct(product) {
    const newProduct = {
      ...product,
      id: createId('product'),
      userId: currentUser.id,
      price: Number(product.price),
    };
    persist([...allProducts, newProduct]);
    return newProduct;
  }

  function updateProduct(id, product) {
    const next = allProducts.map((item) => (
      item.id === id && item.userId === currentUser.id
        ? { ...item, ...product, price: Number(product.price) }
        : item
    ));
    persist(next);
  }

  function deleteProduct(id) {
    persist(allProducts.filter((item) => !(item.id === id && item.userId === currentUser.id)));
    setCompareIds((ids) => ids.filter((itemId) => itemId !== id));
  }

  function getProduct(id) {
    return userProducts.find((product) => product.id === id);
  }

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
    addProduct,
    updateProduct,
    deleteProduct,
    getProduct,
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
