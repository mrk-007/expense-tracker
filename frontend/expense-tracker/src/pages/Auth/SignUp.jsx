import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Redirect to Login — Sign Up form is handled there via a tab
const SignUp = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/login', { replace: true });
  }, [navigate]);
  return null;
};

export default SignUp;