import { Eraser, PackageSearch } from 'lucide-react';
import { Link } from 'react-router-dom';
import CompareTable from '../components/CompareTable.jsx';
import { useProducts } from '../hooks/useProducts.jsx';

export default function ComparePage() {
  const { compareProducts, clearCompare } = useProducts();

  return (
    <div className="page">
      <section className="page-head">
        <div>
          <span className="eyebrow">Сравнение</span>
          <h1>Сравнительная таблица товаров</h1>
          <p>Выберите 2–3 товара в каталоге, чтобы сравнить общие поля и характеристики.</p>
        </div>
        <div className="page-head__actions">
          <button className="button button--ghost" type="button" onClick={clearCompare} disabled={compareProducts.length === 0}>
            <Eraser size={18} />
            Очистить
          </button>
          <Link className="button button--primary" to="/products">
            <PackageSearch size={18} />
            Выбрать товары
          </Link>
        </div>
      </section>

      {compareProducts.length < 2 ? (
        <section className="empty-state">
          <h2>Недостаточно товаров для сравнения</h2>
          <p>Добавьте в сравнение минимум 2 товара. Максимум можно выбрать 3 позиции.</p>
          <Link className="button button--primary" to="/products">Открыть каталог</Link>
        </section>
      ) : (
        <CompareTable products={compareProducts} />
      )}
    </div>
  );
}
