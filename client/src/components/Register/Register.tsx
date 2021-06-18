import React, { useRef, useState } from "react";
import axios from "axios";
const Register: React.FC = () => {
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const lastNameRef = useRef<HTMLInputElement | null>(null);
  const dateRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (e: React.SyntheticEvent): void => {
    e.preventDefault();
    const username: string | undefined = usernameRef?.current?.value;
    const firstName: string | undefined = nameRef?.current?.value;
    const lastName: string | undefined = lastNameRef?.current?.value;
    const birthDate: string | undefined = dateRef?.current?.value;
    const email: string | undefined = emailRef?.current?.value;
    const password: string | undefined = passwordRef?.current?.value;
    console.log( username,
      firstName,
      lastName,
      birthDate,
      email,
      password);
    
    axios
      .post("http://localhost:4000/user/register", {
        username,
        firstName,
        lastName,
        birthDate,
        email,
        password,
      })
      .then(({ data }) => console.log(data))
      .catch(console.log);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label onClick={() => usernameRef.current?.focus()}>Username</label>
      <input ref={usernameRef} />
      <label onClick={() => nameRef.current?.focus()}>First Name</label>
      <input ref={nameRef} />
      <label onClick={() => lastNameRef.current?.focus()}>Last Name</label>
      <input ref={lastNameRef} />
      <label onClick={() => dateRef.current?.focus()}>BirthDate</label>
      <input type="date" ref={dateRef} />
      <label onClick={() => emailRef.current?.focus()}>Email</label>
      <input type="email" ref={emailRef} />
      <label onClick={() => passwordRef.current?.focus()}>Password</label>
      <input type="text" ref={passwordRef} />
      <input type="submit"  />
    </form>
  );
};

export default Register;
