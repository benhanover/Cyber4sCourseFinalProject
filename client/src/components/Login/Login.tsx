// import libraries
import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useRef } from 'react';
import { useHistory } from 'react-router-dom';
import './Login.css'
// redux shit
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { wsActionCreator } from '../../state';

const Login: React.FC = () => {
  const history = useHistory();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  
  const dispatch = useDispatch();
  const { setUser } = bindActionCreators({...wsActionCreator}, dispatch);
  
  return (
    <div className="login-form-container">

      <button className='register-button button' onClick={() => history.push('/register')}>Register</button>
    <div className='login-container'>
      <input ref={emailRef} placeholder="Email"></input>
      <input ref={passwordRef} placeholder="Password"></input>
      <button className='login-button button' onClick={submitLogin}>Login</button>
    </div>
    </div>
  );


  // functions
  // ==========

  // cleanup
  function cleanup(): void {
    if (!(emailRef?.current && passwordRef?.current)) return;
    emailRef.current.value = '';
    passwordRef.current.value = '';
  }

  // logs in
  function submitLogin(): void{
    if (!(emailRef?.current && passwordRef?.current)) return;
    const email = emailRef?.current?.value;
    const password = passwordRef?.current?.value;
    cleanup();
    axios
      .post('http://localhost:4000/user/login', { email, password })
      .then(({ data: response }) => {
        Cookies.set('accessToken', response.accessToken);
        Cookies.set('refreshToken', response.refreshToken);
        setUser(response.user);
      })
      .catch(console.log);
  };
};
export default Login;
