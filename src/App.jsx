import { Navigate, Route, Routes } from 'react-router-dom';
import Header from './components/Header.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AuthProvider } from './hooks/useAuth.jsx';
import { ProductProvider } from './hooks/useProducts.jsx';
import ComparePage from './pages/ComparePage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';

export default function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <div className="app-shell">
          <Header />
          <main className="main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/dashboard"
                element={(
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                )}
              />
              <Route
                path="/products"
                element={(
                  <ProtectedRoute>
                    <ProductsPage />
                  </ProtectedRoute>
                )}
              />
              <Route path="/products/new" element={<Navigate to="/products" replace />} />
              <Route path="/products/edit/:id" element={<Navigate to="/products" replace />} />
              <Route
                path="/compare"
                element={(
                  <ProtectedRoute>
                    <ComparePage />
                  </ProtectedRoute>
                )}
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </ProductProvider>
    </AuthProvider>
  );
}
