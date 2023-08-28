import React,{useState} from 'react';
import logo from '../../assets/logo.png';
import authScreenImage from '../../assets/auth_window_img.svg';
import googleImg from '../../assets/google_image.png';
import githubImg from '../../assets/github_image.png';
import './Register.css';
import axios from 'axios';
import utils from '../../utils/utils';

function Register() {
    const [fname,setFname] = useState("");
    const [lname,setLname] = useState("");
    const [email, setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const google = () => {
        window.open("https://xerocodee-backend.onrender.com/auth/google", "_self");
      };
    const Github = () => {
        window.open("https://xerocodee-backend.onrender.com/auth/github", "_self");
    }
    const RegisterUser = async () => {
        console.log(process.env.REACT_APP_BACKEND_URL)
        if(!fname || !lname || !email || !password || !confirmPassword){
            setMessage("Complete the required fields");
            return;
        }
        if(message === "Password Do Not Match"){
            return;
        }
        let name = fname+' '+lname;
        let params ={
            name,email,password
        }
        setMessage("");
        axios.post(process.env.REACT_APP_BACKEND_URL+'/signup',params)
        .then( response =>{
             console.log(response.data)
             let resData = response.data;
             setMessage(resData.message);
             if(resData.data.token){
                setMessage("Redirecting to Dashboard")
                utils.setCookie('token',resData.data.token);
                window.location.href = '/dashboard';
             }else{
                setMessage("Registration Success. Redirecting to Login!")
                utils.setCookie('username',resData.data.name)
                window.location.href = '/login';
             }  
            })
        .catch(err => {
            console.log(err.response.data);
            let errData = err.response.data;
            setMessage(errData.message)
        });
    }
    return (
        <div className='register-box'>
            <div className='register-box_auth'>
             <div className='auth_details'>
                <img src={logo} alt='logo'/>
                <p className='auth_details-welcome-text'>Hello!</p>
                <div className="register-title-container">
                    <div className="register-horizontal-line"></div>
                    <p className="register-choose-text">Create Your Account</p>
                    <div className="register-horizontal-line"></div>
                </div>
                {message ? <p className='message'>{message}</p>:null}
                <input className='register-box-input' placeholder='First Name...' value={fname}
                onChange={(e) => setFname(e.target.value)}/>
                <input className='register-box-input' placeholder='Last Name...' value={lname}
                onChange={(e)=> setLname(e.target.value)}/>
                <input className='register-box-input' placeholder='Email...' value={email}
                onChange={(e)=> setEmail(e.target.value)}/>
                <input className='register-box-input' placeholder='Password' type='password' value={password}
                onChange={(e) => setPassword(e.target.value)}/>
                <input className='register-box-input' placeholder='Confirm Password' type='password' value={confirmPassword}
                onChange={(e)=> {
                    setConfirmPassword(e.target.value);
                    if(password === e.target.value){
                        setMessage("")
                    }else{
                        setMessage("Password Does Not Match")
                    }
                    }}/>
                <button className='register-box-button' onClick={RegisterUser}>Submit!</button>
                <p className='register-choose-text'> OR </p>
                <div className='social-register-button-group'>
                    <div className='social-register-button' onClick={google}>
                        <p>register with Google!</p>
                        <img src={googleImg} width='40px' height='37px'/>
                    </div>
                    <div className="social-register-button" onClick={Github}>
                        <p>register with Github!</p>
                        <img src={githubImg} width='40px' height='37px'/>
                    </div>
                </div>
                <p className='register-choose-text'>Already have an Account? <a href='/register'><span style={{color: '#1F64FF'}}>SIGN IN</span></a></p>
             </div>
            </div>
            <div className='register-box_icon'>
                <img className='auth-screen-image' src={authScreenImage} alt='authScreenImage' width='90%'/>
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 538 144" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M0 144L22.4167 125.913C44.8333 107.826 89.6667 71.6522 134.5 66.087C179.333 59.8261 224.167 84.1739 269 96C313.833 107.826 358.667 107.826 403.5 89.7391C448.333 71.6522 493.167 36.1739 515.583 18.087L538 0V144H515.583C493.167 144 448.333 144 403.5 144C358.667 144 313.833 144 269 144C224.167 144 179.333 144 134.5 144C89.6667 144 44.8333 144 22.4167 144H0Z" fill="#1F64FF"/>
                </svg>
            </div>
        </div>
    );
}

export default Register;