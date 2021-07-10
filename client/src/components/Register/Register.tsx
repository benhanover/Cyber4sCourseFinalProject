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

        <h1>Roomie</h1>
        <div className="about-container">
        <div className="p1">al fauna pas paucituberculatans[14] and sparassodonts[13][15][16] Large opossums like Didelphis show a pattern of gradually increasing in size over geologic time as sparassodont diversity declined.[15][16] Several groups of opossums, including Thylophorops, Thylatheridium, Hyperdidelphys, and sparassocynins developed carnivorous adaptations during the late Miocene-Pliocene, prior to the arrival of carnivorans in South America. Most of these groups with the exception of Lutreolina are now extinct.</div>
        <div className="p2">al Priums were occupied by other groups of metatherians such as paucituberculatans[14] and sparassodonts[13][15][16] Large opossums like Didelphis show a pattern of gradually increasing in size over geologic time as sparassodont diversity declined.[15][16] Several groups of opossums, including Thylophorops, Thylatheridium, Hyperdidelphys, and sparassocynins developed carnivorous adaptations during the late Miocene-Pliocene, prior to the arrival of carnivorans in South America. Most of these groups with the exception of Lutreolina are now extinct.</div>
        <div className="p3">al   as paucituberculatans[14] and sparassodonts[13][15][16] Large opossums like Didelphis show a pattern of gradually increasing in size over geologic time as sparassodont diversity declined.[15][16] Several groups of opossums, including Thylophorops, Thylatheridium, Hyperdidelphys, and sparassocynins developed carnivorous adaptations during the late Miocene-Pliocene, prior to the arrival of carnivorans in South America. Most of these groups with the exception of Lutreolina are now extinct extinct.</div>
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


