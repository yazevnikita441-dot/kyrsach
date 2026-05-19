import { BarChart3, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import { useProducts } from '../hooks/useProducts.jsx';

export default function ProductsPage() {
  const { products, compareIds, toggleCompare } = useProducts();
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

  return (
    <div className="page">
      <section className="page-head">
        <div>
          <span className="eyebrow">Каталог</span>
          <h1>Список товаров</h1>
          <p>Выбирайте от 2 до 3 товаров из готового каталога, чтобы сравнить характеристики.</p>
        </div>
        <div className="page-head__actions">
          <Link className="button button--ghost" to="/compare">
            <BarChart3 size={18} />
            Сравнить: {compareIds.length}
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
            />
          ))}
        </section>
      ) : (
        <section className="empty-state">
          <h2>Товары не найдены</h2>
          <p>Измените поисковый запрос, чтобы найти товар в готовом каталоге.</p>
        </section>
      )}
    </div>
  );
}
