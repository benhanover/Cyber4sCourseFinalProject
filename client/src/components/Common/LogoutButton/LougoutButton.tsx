// import libraries
import React from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

//import redux
import { bindActionCreators } from 'redux'
import { useDispatch, useSelector } from 'react-redux'
import { State, wsActionCreator } from '../../../state';

const LougoutButton: React.FC = () => {
  const dispatch = useDispatch();
  const { setUser } = bindActionCreators(wsActionCreator, dispatch);
  const {serverSocket} = useSelector((state: State) => state.ws)

  const logout = () => {
    const accessToken = Cookies.get('accessToken');
    const refreshToken = Cookies.get('refreshToken');
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    serverSocket.close();
    setUser(false);
    axios.delete('http://192.168.1.111:4000/user/logout', {
      headers: { authorization: accessToken, refreshToken },
    }).then(()=>{console.log("Removed Succsesfuly");
    })
    .catch( () => console.log("Didn't Removed Successfully"))
  };

  return <button className='logout-button' onClick={logout}>Logout</button>;
};
export default LougoutButton;
