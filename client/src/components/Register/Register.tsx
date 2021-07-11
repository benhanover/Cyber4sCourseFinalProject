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
        <div className="p1">hi there and welcome, where ever you are just room in! </div>
      <div className="p2">if you looking for a study evnironment , a place to learn and concentrate you arived.  we offer you a Pleasant atmosphere that encourages you to enter into  optimal state of learning. Overcome the difficulty together with other people like you who gather for the purpose of learning.you can use the help of other students , see them on video, communicate ,  consult, share your screen with them and more.
       </div>
      <div className="p3"> all you need to do is just connect, find a room that matches your theme, or follow your curiosity and join a room on a new subject , get to know people who familiar with it. OR open your one room with  a subject of your choice. You can control the number of participants in the room, decide who has access to it, and make it private.
          To know a little more   about the students in the room you can view their profile.  so lets get started: register, edit your profile and room in</div>
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
       <div className="omrs-input-group"><label className="omrs-input-filled"><input  required type="text" ref={passwordRef} /> <span className="omrs-input-label">Password</span> </label></div> 
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


