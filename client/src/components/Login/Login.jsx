import React, { useEffect, useState } from 'react';
import logo from '../../assets/logo.png';
import googleImg from '../../assets/google_image.png'
import githubImg from '../../assets/github_image.png'
import authScreenImage from '../../assets/auth_window_img.svg';
import './Login.css';
import utils from '../../utils/utils';
import axios from 'axios';
function Login() {

    const [email, setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");

    const google = () => {
        window.open("http://localhost:5000/auth/google", "_self");
      };
    const Github = () => {
        window.open("http://localhost:5000/auth/github", "_self");
    }
    const LoginUser = async () => {
        if(!email || !password ){
            setMessage("Complete the required fields");
            return;
        }
        let params ={
            email,password
        }
        setMessage("");
        axios.post(process.env.REACT_APP_BACKEND_URL+'/login',params)
        .then( response =>{
             console.log(response.data)
             let resData = response.data;
             setMessage(resData.message);
             if(resData.data.token){
                setMessage("Redirecting to Dashboard")
                utils.setCookie('token',resData.data.token);
                window.location.href = '/dashboard';
             }else{
                setMessage("Some Error has Occured! Please login Again!")
             }  
            })
        .catch(err => {
            console.log(err.response.data);
            let errData = err.response.data;
            setMessage(errData.message)
        });
    }
    useEffect(()=>{
        let username = utils.getCookie('username');
        if(username){
            setName(username)
        }
    },[])
    return (
        <div className='login-box'>
            <div className='login-box_auth'>
             <div className='auth_details'>
                <img src={logo} alt='logo'/>
                <p className='auth_details-welcome-text'>{name ? `Welcome! ${name}`: 'Welcome Back!'}</p>
                <div className="login-title-container">
                    <div className="login-horizontal-line"></div>
                    <p className="login-choose-text">Login To your Account</p>
                    <div className="login-horizontal-line"></div>
                </div>
                {message ? <p className='message'>{message}</p>:null}
                <input className='login-box-input' placeholder='Email...' value={email} 
                onChange={(e) => {
                    setEmail(e.target.value);
                }}/>
                <input className='login-box-input' placeholder='Password' type='password'
                value={password} onChange={(e) => setPassword(e.target.value)}/>
                <button className='login-box-button' onClick={LoginUser}>Submit!</button>
                <p className='login-choose-text'> OR </p>
                <div className='social-login-button-group'>
                    <div className='social-login-button' onClick={google}>
                        <p>Login with Google!</p>
                        <img src={googleImg} width='40px' height='37px'/>
                    </div>
                    <div className="social-login-button" onClick={Github}>
                        <p>Login with Github!</p>
                        <img src={githubImg} width='40px' height='37px'/>
                    </div>
                </div>
                <p className='login-choose-text'>Don't Have an Account? <a href='/register'><span style={{color: '#1F64FF'}}>SIGN UP</span></a></p>
             </div>
            </div>
            <div className='login-box_icon'>
                <img className='auth-screen-image' src={authScreenImage} alt='authScreenImage' width='90%'/>
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 538 144" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M0 144L22.4167 125.913C44.8333 107.826 89.6667 71.6522 134.5 66.087C179.333 59.8261 224.167 84.1739 269 96C313.833 107.826 358.667 107.826 403.5 89.7391C448.333 71.6522 493.167 36.1739 515.583 18.087L538 0V144H515.583C493.167 144 448.333 144 403.5 144C358.667 144 313.833 144 269 144C224.167 144 179.333 144 134.5 144C89.6667 144 44.8333 144 22.4167 144H0Z" fill="#1F64FF"/>
                </svg>
            </div>
        </div>
    );
}

export default Login;