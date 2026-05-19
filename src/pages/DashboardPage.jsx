import { BarChart3, Package, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { useProducts } from '../hooks/useProducts.jsx';

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const { products, compareProducts } = useProducts();
  const totalPrice = products.reduce((sum, product) => sum + Number(product.price || 0), 0);

  return (
    <div className="page">
      <section className="page-head">
        <div>
          <span className="eyebrow">Личный кабинет</span>
          <h1>{currentUser.name}, управляйте каталогом товаров</h1>
          <p>Здесь видна сводка по вашим товарам и быстрые действия для работы с приложением.</p>
        </div>
        <Link className="button button--primary" to="/products/new">
          <PlusCircle size={18} />
          Добавить товар
        </Link>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <Package size={26} />
          <span>Товаров</span>
          <strong>{products.length}</strong>
        </article>
        <article className="stat-card">
          <BarChart3 size={26} />
          <span>В сравнении</span>
          <strong>{compareProducts.length}</strong>
        </article>
        <article className="stat-card">
          <Package size={26} />
          <span>Общая стоимость</span>
          <strong>{totalPrice.toLocaleString('ru-RU')} ₽</strong>
        </article>
      </section>

      <section className="quick-actions">
        <Link to="/products">Открыть список товаров</Link>
        <Link to="/compare">Перейти к сравнению</Link>
      </section>
    </div>
  );
}
