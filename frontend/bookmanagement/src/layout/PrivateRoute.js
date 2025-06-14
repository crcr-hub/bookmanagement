import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return isAuthenticated ? children : <Navigate to="/loginpage" />;
};

export default PrivateRoute;
