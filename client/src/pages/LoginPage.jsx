// LoginPage.js
import React from "react";

const LoginPage = () => {
  return (
    <div>
      <h1>Login</h1>
      <a href="/auth/google">
        <button>Login with Google</button>
      </a>
      <a href="/auth/facebook">
        <button>Login with Facebook</button>
      </a>
    </div>
  );
};

export default LoginPage;
