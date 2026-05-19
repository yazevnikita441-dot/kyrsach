import { LogOut, PackageSearch, UserRound } from 'lucide-react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

export default function Header() {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="header">
      <div className="container header__inner">
        <Link className="brand" to="/">
          <span className="brand__icon"><PackageSearch size={22} /></span>
          <span>ProductCompare</span>
        </Link>

        <nav className="nav">
          <NavLink to="/">Главная</NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/products">Товары</NavLink>
              <NavLink to="/compare">Сравнение</NavLink>
            </>
          )}
          {!isAuthenticated ? (
            <div className="nav__actions">
              <NavLink className="button button--ghost" to="/login">Вход</NavLink>
              <NavLink className="button button--primary" to="/register">Регистрация</NavLink>
            </div>
          ) : (
            <div className="nav__actions nav__user">
              <span className="user-chip"><UserRound size={16} />{currentUser.name}</span>
              <button className="button button--ghost" type="button" onClick={handleLogout}>
                <LogOut size={16} />
                Выйти
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
