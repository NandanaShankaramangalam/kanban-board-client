import React from "react";
import AuthForm from "../components/AuthForm";

const LoginPage = () => {
  return (
    <div className="flex items-center justify-center mt-10">
      <AuthForm mode="login" />
    </div>
  );
};

export default LoginPage;
