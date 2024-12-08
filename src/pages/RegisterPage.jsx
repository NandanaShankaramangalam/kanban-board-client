import React from 'react';
import AuthForm from '../components/AuthForm';

const SignUpPage = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <AuthForm mode="register" />
    </div>
  );
};

export default SignUpPage;
