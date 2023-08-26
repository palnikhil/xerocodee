import React from 'react';
import logo from '../../assets/logo.png';
import authScreenImage from '../../assets/auth_window_img.svg';
import './Login.css';

function Login() {
    const google = () => {
        const sameOriginContext = window.open("http://localhost:5000/auth/google", "_self");
        console.log(sameOriginContext)
      };
    const Github = () => {
        window.open("http://localhost:5000/auth/github", "_self");
    }
    return (
        <div className='login-box'>
            <div className='login-box_auth'>
             <div className='auth_details'>
                <img src={logo} alt='logo'/>
                <p className='auth_details-welcome-text'>Welcome Back!</p>
                <p>Login</p>
                <input />
                <input />
                <button>Submit!</button>
                <p> OR </p>
                <div>
                    <button onClick={google}>Sign In with Google</button>
                    <button onClick={Github}>Sign In with Github</button>
                </div>
             </div>
            </div>
            <div className='login-box_divider'></div>
            <div className='login-box_icon'>
                <img className='auth-screen-image' src={authScreenImage} alt='authScreenImage'/>
                <svg xmlns="http://www.w3.org/2000/svg" width="90%" viewBox="0 0 538 144" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M0 144L22.4167 125.913C44.8333 107.826 89.6667 71.6522 134.5 66.087C179.333 59.8261 224.167 84.1739 269 96C313.833 107.826 358.667 107.826 403.5 89.7391C448.333 71.6522 493.167 36.1739 515.583 18.087L538 0V144H515.583C493.167 144 448.333 144 403.5 144C358.667 144 313.833 144 269 144C224.167 144 179.333 144 134.5 144C89.6667 144 44.8333 144 22.4167 144H0Z" fill="#1F64FF"/>
                </svg>
            </div>
        </div>
    );
}

export default Login;