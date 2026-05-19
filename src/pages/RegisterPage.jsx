import { UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { validateAuth } from '../utils/validators.js';

export default function RegisterPage() {
  const { register } = useAuth();
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
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <span className="eyebrow">Регистрация</span>
        <h1>Создание аккаунта</h1>
        <p className="muted">После регистрации для аккаунта будут добавлены демонстрационные товары.</p>

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
    </div>
  );
}
