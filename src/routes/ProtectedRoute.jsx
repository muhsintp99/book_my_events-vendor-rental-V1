import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token'); // check if logged in

  if (!token) {
    // not logged in → redirect to login
    return <Navigate to="/login" replace />;
  }
  return children;
}
