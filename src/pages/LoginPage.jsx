import { LogIn } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { validateAuth } from '../utils/validators.js';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
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

    const result = login(form);
    if (!result.ok) {
      setMessage(result.message);
      return;
    }

    navigate(location.state?.from || '/products');
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <span className="eyebrow">Вход</span>
        <h1>Добро пожаловать</h1>
        <p className="muted">Введите данные аккаунта, чтобы открыть личный кабинет.</p>

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
          <LogIn size={16} />
          Войти
        </button>
        <p className="auth-switch">Нет аккаунта? <Link to="/register">Зарегистрироваться</Link></p>
      </form>
    </div>
  );
}
