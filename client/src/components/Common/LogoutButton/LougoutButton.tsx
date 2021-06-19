import React from 'react';
import Cookies from 'js-cookie';

const LougoutButton: React.FC = () => {
  const logout = () => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
  };
  return <button onClick={logout}>Logout</button>;
};
export default LougoutButton;
