import { LogOut, Menu, PackageSearch, UserRound, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

export default function Header() {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    setIsOpen(false);
    navigate('/');
  }

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="header">
      <div className="container header__inner">
        <Link className="brand" to="/" onClick={closeMenu}>
          <span className="brand__icon"><PackageSearch size={22} /></span>
          <span>ProductCompare</span>
        </Link>

        <button
          className="icon-button header__toggle"
          type="button"
          aria-label={isOpen ? 'Закрыть меню' : 'Открыть меню'}
          onClick={() => setIsOpen((value) => !value)}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <nav className={`nav ${isOpen ? 'nav--open' : ''}`}>
          <NavLink to="/" onClick={closeMenu}>Главная</NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/products" onClick={closeMenu}>Товары</NavLink>
              <NavLink to="/compare" onClick={closeMenu}>Сравнение</NavLink>
            </>
          )}
          {!isAuthenticated ? (
            <div className="nav__actions">
              <NavLink className="button button--ghost" to="/login" onClick={closeMenu}>Вход</NavLink>
              <NavLink className="button button--primary" to="/register" onClick={closeMenu}>Регистрация</NavLink>
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
