// import libraries
import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './Login.css'

// import enums
import { enums } from "../../utils/enums"

// redux shit
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { wsActionCreator } from "../../state";

const Login: React.FC = () => {
  const history = useHistory();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [errorDiv, setErrorDiv] = useState<any>(false);

  const dispatch = useDispatch();
  const { setUser } = bindActionCreators({ ...wsActionCreator }, dispatch);

  return (
    <div className="login-component">
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
      <button
        className="register-btn button"
        onClick={() => history.push("/register")}
      >
        Register
      </button>
    <div className="login-form-container" onClick={() => setErrorDiv(false)}>
    
      
    <div className="omrs-input-group"><label className="omrs-input-filled"><input required ref={emailRef} ></input><span className="omrs-input-label">Email</span></label></div>
    <div className="omrs-input-group"><label className="omrs-input-filled"><input required ref={passwordRef} ></input><span className="omrs-input-label">Password</span></label></div>
        <button className="submit-btn" onClick={submitLogin}>
          Login
        </button>
      
    
        {
          errorDiv&&
          <div>{errorDiv}</div>
        }
      </div>
    </div>
  );
//<div className="omrs-input-group"><label className="omrs-input-filled"><input  required type="text" ref={passwordRef} /> <span className="omrs-input-label">Password</span> </label></div>
  // functions
  // ==========

  // cleanup
  function cleanup(): void {
    if (!(emailRef?.current && passwordRef?.current)) return;
    emailRef.current.value = "";
    passwordRef.current.value = "";
  }

  // logs in
  function submitLogin(): void {
    if (!(emailRef?.current && passwordRef?.current)) return;
    const email = emailRef?.current?.value;
    const password = passwordRef?.current?.value;
    cleanup();
    axios
      .post(`${enums.baseUrl}/user/login`, { email, password })
      .then(({ data: response }) => {
        Cookies.set("accessToken", response.accessToken);
        Cookies.set("refreshToken", response.refreshToken);
        setUser(response.user);
      })
      .catch(e => {
        if (!e.response?.data) {
          setErrorDiv(enums.noConnection)
          return;
        }
        setErrorDiv(e.response.data.message)
      });
  }
};
export default Login;
