import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        color: 'var(--color-text-secondary)',
        background: 'var(--color-bg-primary)'
      }}>
        Authenticating...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' state={{ from: location.pathname }} replace />;
  }

  if (user && user.role !== 'admin') {
    return <Navigate to='/' replace />;
  }

  return children;
};

export default AdminRoute;
