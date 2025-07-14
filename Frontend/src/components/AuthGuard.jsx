import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

const AuthGuard = ({ children }) => {
  const token = localStorage.getItem('jwtToken');

  if (!token) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

AuthGuard.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthGuard;
