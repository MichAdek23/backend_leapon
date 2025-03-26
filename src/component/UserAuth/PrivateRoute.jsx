import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Check if payment is required
  if (!user.paymentCompleted) {
    return <Navigate to="/payment" />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute; 