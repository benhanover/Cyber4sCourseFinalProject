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

      <h1>Roomie</h1>
      <div className="about-container">
      <div className="p1">al fauna pas paucituberculatans[14] and sparassodonts[13][15][16] Large opossums like Didelphis show a pattern of gradually increasing in size over geologic time as sparassodont diversity declined.[15][16] Several groups of opossums, including Thylophorops, Thylatheridium, Hyperdidelphys, and sparassocynins developed carnivorous adaptations during the late Miocene-Pliocene, prior to the arrival of carnivorans in South America. Most of these groups with the exception of Lutreolina are now extinct.</div>
      <div className="p2">al Priums were occupied by other groups of metatherians such as paucituberculatans[14] and sparassodonts[13][15][16] Large opossums like Didelphis show a pattern of gradually increasing in size over geologic time as sparassodont diversity declined.[15][16] Several groups of opossums, including Thylophorops, Thylatheridium, Hyperdidelphys, and sparassocynins developed carnivorous adaptations during the late Miocene-Pliocene, prior to the arrival of carnivorans in South America. Most of these groups with the exception of Lutreolina are now extinct.</div>
      <div className="p3">al   as paucituberculatans[14] and sparassodonts[13][15][16] Large opossums like Didelphis show a pattern of gradually increasing in size over geologic time as sparassodont diversity declined.[15][16] Several groups of opossums, including Thylophorops, Thylatheridium, Hyperdidelphys, and sparassocynins developed carnivorous adaptations during the late Miocene-Pliocene, prior to the arrival of carnivorans in South America. Most of these groups with the exception of Lutreolina are now extinct extinct.</div>
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
