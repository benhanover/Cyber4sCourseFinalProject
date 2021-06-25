// import libraries
import React from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

//import redux
import { bindActionCreators } from 'redux'
import { useDispatch } from 'react-redux'
import { wsActionCreator } from '../../../state';

const LougoutButton: React.FC = () => {
  const dispatch = useDispatch();
  const { setIsLogged } = bindActionCreators(wsActionCreator, dispatch);


  const logout = async () => {
    const accessToken = Cookies.get('accessToken');
    const refreshToken = Cookies.get('refreshToken');
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    const removed = await axios.delete('http://localhost:4000/user/logout', {
      headers: { authorization: accessToken, refreshToken },
    });
    if (removed) {
      setIsLogged(false);
      return;
    }
    console.log("Didn't Removed Successfully");
  };

  return <button className='logout-button' onClick={logout}>Logout</button>;
};
export default LougoutButton;
