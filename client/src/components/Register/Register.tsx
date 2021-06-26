// import libraries
import React, { useRef } from 'react';
import Cookies from 'js-cookie';
import { useDispatch} from 'react-redux';
import { bindActionCreators } from 'redux';
import { useHistory } from 'react-router-dom';

// react shit
import { wsActionCreator } from '../../state';

// import functions

import {register} from './functions'

const Register: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { setUser } = bindActionCreators({...wsActionCreator}, dispatch);
  
  // refs
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const lastNameRef = useRef<HTMLInputElement | null>(null);
  const dateRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const profileImageRef = useRef<HTMLInputElement | null>(null);
  const addressRef = useRef<HTMLInputElement | null>(null);
  const statusRef = useRef<HTMLTextAreaElement | null>(null);
  const aboutRef = useRef<HTMLTextAreaElement | null>(null);
  const intrestsRef = useRef<HTMLTextAreaElement | null>(null);
  const hobbysRef = useRef<HTMLTextAreaElement | null>(null);
  const relationshipStatusRef = useRef<HTMLSelectElement | null>(null);



  const goToLogin = () => {
    history.push('/');
  }
  return (
    <form onSubmit={handleSubmit}>
      <button className='login-button' onClick={goToLogin}>Login</button>
      <input ref={usernameRef} placeholder="Username" />
      <input ref={nameRef}  placeholder="First Name"/>
      <input ref={lastNameRef} placeholder="Last Name"/>
      <input type='date' ref={dateRef} placeholder="BirthDate"/>
      <input type='email' ref={emailRef} placeholder="Email"/>
      <input type='text' ref={passwordRef} placeholder="Password" />
      <br />
      <br />
      <br />
      <input type='file' ref={profileImageRef} accept="image/*" />
      <input type='text' ref={addressRef} placeholder="address" />
      <textarea ref={statusRef} placeholder='Status' />
      <textarea ref={aboutRef} placeholder='About' />
      <textarea ref={intrestsRef} placeholder='intrests' />
      <textarea ref={hobbysRef} placeholder='hobbys' />
      <select ref={relationshipStatusRef}>
        <option value='single'>Single</option>
        <option value='married'>Married</option>
        <option value='relationship'>In A Relationship</option>
      </select>
      <h4>Best hours to catch me inside?</h4>
      <label>08:00-16:00</label>
        <input type='checkbox' value='08:00-16:00' id='morning' />
      <label>16:00-00:00</label>
        <input type='checkbox' value='16:00-00:00' id='evening' />
      <label>00:00-08:00</label>
        <input type='checkbox' value='00:00-08:00' id='night' />
        

      <input type='submit' />
    </form>
  );

  // functions
/*-----------------------------------------------------------------------------------------------------------------*/
function cleanup(): void {
  if(!(usernameRef?.current && nameRef?.current && lastNameRef?.current && dateRef?.current && emailRef?.current && passwordRef?.current)) return;
  usernameRef.current.value = '';
  nameRef.current.value = '';
  lastNameRef.current.value = '';
  dateRef.current.value = '';
  emailRef.current.value = '';
  passwordRef.current.value = '';
}

/*-----------------------------------------------------------------------------------------------------------------*/
  async function handleSubmit(e: React.SyntheticEvent): Promise<void> {
    e.preventDefault();
    
    if(!(usernameRef?.current && nameRef?.current && lastNameRef?.current && dateRef?.current && emailRef?.current && passwordRef?.current)) return;
    const username: string | undefined = usernameRef.current?.value;
    const firstName: string | undefined = nameRef.current?.value;
    const lastName: string | undefined = lastNameRef.current?.value;
    const birthDate: string | undefined = dateRef.current?.value;
    const email: string | undefined = emailRef.current?.value;
    const password: string | undefined = passwordRef.current?.value;

    // clean up
    cleanup();
    try {
      const { data: response } = await register(username, firstName, lastName, birthDate, email, password);
      Cookies.set('accessToken', response.accessToken);
      Cookies.set('refreshToken', response.refreshToken);
      setUser(response.user)
    } catch (e) {
      console.log("couldn't register", e);
    }
  };
};

export default Register;
