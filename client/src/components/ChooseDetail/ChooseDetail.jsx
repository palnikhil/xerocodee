import React,{useEffect, useState} from "react";
import './ChooseDetail.css';
import logo from '../../assets/logo.png';
import HostingSelection from "./HostingSelection/HostingSelection";
import axios from "axios";
import utils from "../../utils/utils";
function ChooseDetail(){
    const [inputActive,setInputActive] = useState(false);
    const [inputType, setInputType] = useState("");
    const [inputVal,setInputVal] = useState("");
    const [complete,setComplete] = useState(false);
    const [userData, setUserData] = useState({});
    const [message, setMessage] = useState("");
    const [token, setToken] = useState("");

    const OptionUpdate = () =>{
        if(!inputType || !inputVal){
            setMessage("No Input Provided!");
            return;
        }
        var config = {
            method: 'put',
            url: process.env.REACT_APP_BACKEND_URL+`/update?field=${inputType}&value=${inputVal}`,
            headers: { 
              'Authorization': 'Bearer '+token, 
            }
          };
          
          axios(config)
          .then(function (response) {
            console.log(JSON.stringify(response.data.data));
            if(response.data.code === 200){
                setComplete(true);
                setMessage(response.data.message)
            }
            else{
                setMessage(response.data.message)
            }
          })
          .catch(function (error) {
            if(error.response.code === 401){
                window.location.href = '/login';
            }
            console.log(error.response.data);
            setMessage(error.response.data.message);
        });
    }

    useEffect(()=>{
        let token = utils.getCookie('token');
        if(token){
            setToken(token)
            var config = {
                method: 'get',
                url: process.env.REACT_APP_BACKEND_URL+'/user-info',
                headers: { 
                  'Authorization': 'Bearer '+token, 
                }
              };
              
              axios(config)
              .then(function (response) {
                console.log(JSON.stringify(response.data.data));
                setUserData(response.data.data);
              })
              .catch(function (error) {
                window.location.href = '/login';
                console.log(error.response.data);});
        }else{
            window.location.href = '/login';
        }
    },[])
    return(
            <div className="detail-box">
                <img src={logo} alt="logo"/>
                <p className="title-text">Welcome, {userData.name ? userData.name : userData.username}</p>
                {message ? <p className='message'>{message}</p>:null}
                {complete ? <HostingSelection token={token} message={setMessage}/> :
                    (
                    <div>
                        <div className="title-container">
                            <div className="horizontal-line"></div>
                            <p className="choose-text">Choose from the following </p>
                            <div className="horizontal-line"></div>
                        </div>
                        <div className="detail-box_button-container">
                            <button className="detail-box_button" onClick={()=>{
                                    setInputActive(true);
                                    setInputType("Developer")
                            }}>Developer</button>
                            <button className="detail-box_button" onClick={() => {
                                        setInputActive(true);
                                        setInputType("Company")
                            }}>Company</button>
                            <button className="detail-box_button" onClick={() => {
                                        setInputActive(true);
                                        setInputType('Organisation')
                            }}>Organisation</button>
                        </div>
                        {inputActive && (
                            <div className="input-box">
                                <input className="text-input-box" type="text" placeholder={`${inputType} Name`} value={inputVal} onChange={(e) => setInputVal(e.target.value)}/>
                                <button onClick={OptionUpdate}>Submit</button>
                            </div>
                        ) }
                    </div>
                    )
                }
            </div>
    );
}

export default ChooseDetail;