// import libraries
import React, { useRef, useState } from 'react';
import Cookies from 'js-cookie';
import { useDispatch} from 'react-redux';
import { bindActionCreators } from 'redux';
import { useHistory } from 'react-router-dom';
import './Register.css';

// react shit
import { wsActionCreator } from "../../state";

// import functions

import {register} from './functions'
import { enums } from '../../utils/enums';

const Register: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { setUser } = bindActionCreators({ ...wsActionCreator }, dispatch);

  // refs
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const lastNameRef = useRef<HTMLInputElement | null>(null);
  const dateRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const [errorDiv, setErrorDiv] = useState<any>(false);
 
  return (
    <div className="register-container">
      <div className="rectangle-shape">

        <h1>Room-in</h1>
        <div className="about-container">
        <div className="p1">Welcome To Room-in!
The place where you can find study partners in a click of a button, and study within the most ideal environment that was designed for an optimal learning experience.

</div>
      <div className="p2">Room-in provides you the environment you need in order to maximize productivity.
We offer video chat rooms that you can either create or join by prefrences such as subject and room capacity.
Create your own uniqe profile to let other users know you better.

       </div>
      <div className="p3"> Overcome the difficulty of studying alone by meeting new people that share your interests.
We encourge you to travel rooms, expand and share youre knowledge, and most of all have fun doing that!
</div>
        </div>
      </div>
      <div className="triangle-shape"></div>
      <div className="shadow-box-elem"></div>
      <button className="login-btn button" onClick={() => history.push("/")}>
        Login
      </button>
      <form className="register-form" onSubmit={handleSubmit}>
       <div className="omrs-input-group"><label className="omrs-input-filled"><input  required ref={usernameRef}  /> <span className="omrs-input-label">Username</span> </label></div> 
       <div className="omrs-input-group"><label className="omrs-input-filled"><input  required ref={nameRef}  /> <span className="omrs-input-label">First Name</span> </label></div> 
       <div className="omrs-input-group"><label className="omrs-input-filled"><input  required ref={lastNameRef}  /> <span className="omrs-input-label">Last Name</span> </label></div> 
       <div className="omrs-input-group"><label className="omrs-input-filled"><input className="date-holder"  required type="date" ref={dateRef}  /> <span className="omrs-input-label">BirthDate</span> </label></div> 
       <div className="omrs-input-group"><label className="omrs-input-filled"><input  required type="email" ref={emailRef} /> <span className="omrs-input-label">Email</span> </label></div> 
       <div className="omrs-input-group"><label className="omrs-input-filled"><input  required type="password" ref={passwordRef} /> <span className="omrs-input-label">Password</span> </label></div> 
      <input type="submit" className="button submit-btn" value="Register" /> 
      
      {
          errorDiv&& 
          <p>{errorDiv}</p>
        }
      </form>
    </div>
  );

  // functions
  /*-----------------------------------------------------------------------------------------------------------------*/
  function cleanup(): void {
    if (
      !(
        usernameRef?.current &&
        nameRef?.current &&
        lastNameRef?.current &&
        dateRef?.current &&
        emailRef?.current &&
        passwordRef?.current
      )
    )
      return;
    usernameRef.current.value = "";
    nameRef.current.value = "";
    lastNameRef.current.value = "";
    dateRef.current.value = "";
    emailRef.current.value = "";
    passwordRef.current.value = "";
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
      const { data: response } = await register(
        username,
        firstName,
        lastName,
        birthDate,
        email,
        password
      );
      Cookies.set("accessToken", response.accessToken);
      Cookies.set("refreshToken", response.refreshToken);
      setUser(response.user);
    } catch (e) {
      if (!e.response?.data) {
        setErrorDiv(enums.noConnection)
        return;
      }
      setErrorDiv(e.response.data.message);
    }
  }
};

export default Register;


