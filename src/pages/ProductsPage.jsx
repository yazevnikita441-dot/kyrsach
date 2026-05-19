import { BarChart3, PlusCircle, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import { useProducts } from '../hooks/useProducts.jsx';

export default function ProductsPage() {
  const { products, compareIds, toggleCompare, deleteProduct } = useProducts();
  const [query, setQuery] = useState('');

  const filteredProducts = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) {
      return products;
    }

    return products.filter((product) => (
      product.name.toLowerCase().includes(value)
      || product.category.toLowerCase().includes(value)
      || product.brand.toLowerCase().includes(value)
    ));
  }, [products, query]);

  function handleDelete(id) {
    const product = products.find((item) => item.id === id);
    if (window.confirm(`Удалить товар «${product?.name || 'без названия'}»?`)) {
      deleteProduct(id);
    }
  }

  return (
    <div className="page">
      <section className="page-head">
        <div>
          <span className="eyebrow">Каталог</span>
          <h1>Список товаров</h1>
          <p>Добавляйте позиции, редактируйте данные и выбирайте от 2 до 3 товаров для сравнения.</p>
        </div>
        <div className="page-head__actions">
          <Link className="button button--ghost" to="/compare">
            <BarChart3 size={18} />
            Сравнить: {compareIds.length}
          </Link>
          <Link className="button button--primary" to="/products/new">
            <PlusCircle size={18} />
            Добавить товар
          </Link>
        </div>
      </section>

      <label className="search-field">
        <Search size={18} />
        <input placeholder="Поиск по названию, категории или бренду" value={query} onChange={(event) => setQuery(event.target.value)} />
      </label>

      {filteredProducts.length > 0 ? (
        <section className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              selected={compareIds.includes(product.id)}
              compareDisabled={compareIds.length >= 3}
              onToggleCompare={toggleCompare}
              onDelete={handleDelete}
            />
          ))}
        </section>
      ) : (
        <section className="empty-state">
          <h2>Товары не найдены</h2>
          <p>Измените поисковый запрос или добавьте новый товар.</p>
          <Link className="button button--primary" to="/products/new">Добавить товар</Link>
        </section>
      )}
    </div>
  );
}
