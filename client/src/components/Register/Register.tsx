import React, { useRef, useState } from 'react';

const Register: React.FC = () => {
  const name = useRef<HTMLInputElement | null>(null);
  const lastName = useRef<HTMLInputElement | null>(null);
  const date = useRef<HTMLInputElement | null>(null);
  const email = useRef<HTMLInputElement | null>(null);
  const password = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (e: React.SyntheticEvent): void => {
    e.preventDefault();
    console.log(e);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label onClick={() => name.current?.focus()}>First Name</label>
      <input ref={name} />
      <label onClick={() => lastName.current?.focus()}>Last Name</label>
      <input ref={lastName} />
      <label onClick={() => date.current?.focus()}>BirthDate</label>
      <input ref={date} />
      <label onClick={() => email.current?.focus()}>Email</label>
      <input ref={email} />
      <label onClick={() => password.current?.focus()}>Password</label>
      <input ref={password} />
    </form>
  );
};

export default Register;
