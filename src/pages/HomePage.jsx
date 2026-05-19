import { ArrowRight, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { validateAuth } from '../utils/validators.js';

export default function HomePage() {
  const { isAuthenticated, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    const validationErrors = validateAuth(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const result = register(form);
    if (!result.ok) {
      setMessage(result.message);
      return;
    }

    navigate('/products');
  }

  return (
    <div className="page">
      <section className="hero hero--compact">
        <div className="hero__content">
          <span className="eyebrow">Курсовой проект · React + Vite</span>
          <h1>Сравнение характеристик товаров</h1>
          <p>
            Простое приложение для добавления товаров, хранения данных в браузере
            и сравнения характеристик в таблице.
          </p>
          {isAuthenticated ? (
            <div className="hero__actions">
              <Link className="button button--primary button--large" to="/products">
                Перейти к товарам
                <ArrowRight size={18} />
              </Link>
              <Link className="button button--ghost button--large" to="/compare">Открыть сравнение</Link>
            </div>
          ) : (
            <p className="hero-note">Зарегистрируйтесь, и тестовые товары появятся автоматически.</p>
          )}
        </div>

        {!isAuthenticated && (
          <form className="auth-card hero-auth" onSubmit={handleSubmit}>
            <span className="eyebrow">Быстрый старт</span>
            <h2>Создать аккаунт</h2>
            <label>
              Имя
              <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </label>
            <label>
              E-mail
              <input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
              {errors.email && <span className="error">{errors.email}</span>}
            </label>
            <label>
              Пароль
              <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
              {errors.password && <span className="error">{errors.password}</span>}
            </label>
            {message && <div className="alert alert--error">{message}</div>}
            <button className="button button--primary button--full" type="submit">
              <UserPlus size={16} />
              Зарегистрироваться
            </button>
            <p className="auth-switch">Уже есть аккаунт? <Link to="/login">Войти</Link></p>
          </form>
        )}
      </section>
    </div>
  );
}
