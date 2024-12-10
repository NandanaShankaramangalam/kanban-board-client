import React from "react";
import AuthForm from "../components/AuthForm";

const SignUpPage = () => {
  return (
    <div className="flex items-center justify-center mt-10">
      <AuthForm mode="register" />
    </div>
  );
};

export default SignUpPage;
