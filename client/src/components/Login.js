import React from 'react';
import '../styles/login.scss';
import logo from '../assets/MoneyWise.png';


function Login() {
  return (
    <div className="login">
      <div className='login-box'>
          <img src={logo} />
          <p>New way to save money</p>
      </div>
    </div>
  );
}

export default Login;