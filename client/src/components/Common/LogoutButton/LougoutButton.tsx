import React from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const LougoutButton: React.FC = () => {
  const logout = async () => {
    const accessToken = Cookies.get('accessToken');
    const refreshToken = Cookies.get('refreshToken');
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    const removed = await axios.delete('http://localhost:4000/user/logout', {
      headers: { authorization: accessToken, refreshToken },
    });
    if (removed) {
      console.log('Removed Successfully');
      return;
    }
    console.log("Didn't Removed Successfully");
  };
  return <button onClick={logout}>Logout</button>;
};
export default LougoutButton;
