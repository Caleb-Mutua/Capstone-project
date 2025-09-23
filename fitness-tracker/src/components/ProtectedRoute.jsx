// src/components/ProtectedRoute.jsx
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  if (!currentUser) {
    // If no user is logged in, redirect them to the login page
    return <Navigate to="/login" />;
  }
  return children;
}