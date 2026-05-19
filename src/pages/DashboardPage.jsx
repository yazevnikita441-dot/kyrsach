import { BarChart3, Package } from 'lucide-react';
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
          <h1>{currentUser.name}, выбирайте товары для сравнения</h1>
          <p>Здесь видна сводка по готовому каталогу и выбранным позициям для сравнения.</p>
        </div>
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
