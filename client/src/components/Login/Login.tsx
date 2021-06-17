import React, { useRef, useState } from 'react';

const Login: React.FC = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [stuff, setStuff] = useState('');
  const submitLogin = () => {
    const email = emailRef?.current?.value;
    const password = passwordRef?.current?.value;
    setStuff(email + ' ' + password);
  };

  return (
    <div>
      email
      <input ref={emailRef}></input>
      password
      <input ref={passwordRef}></input>
      <button onClick={submitLogin}></button>
      {stuff}
    </div>
  );
};
export default Login;
