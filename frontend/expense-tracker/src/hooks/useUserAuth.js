import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

/**
 * Hook that protects a route — redirects to /login if not authenticated.
 * Returns the current user object.
 */
const useUserAuth = () => {
  const { user, token } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
    }
  }, [token, navigate]);

  return { user, token };
};

export default useUserAuth;
