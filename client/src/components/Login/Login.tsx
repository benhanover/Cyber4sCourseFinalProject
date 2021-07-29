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
      <button
        className="register-btn button"
        onClick={() => history.push("/register")}
      >
        Register
      </button>
    <div className="login-form-container" onClick={() => setErrorDiv(false)}>
    
      
    <div className="omrs-input-group"><label className="omrs-input-filled"><input required ref={emailRef} ></input><span className="omrs-input-label">Email</span></label></div>
    <div className="omrs-input-group"><label className="omrs-input-filled"><input required ref={passwordRef} type="password"></input><span className="omrs-input-label">Password</span></label></div>
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
