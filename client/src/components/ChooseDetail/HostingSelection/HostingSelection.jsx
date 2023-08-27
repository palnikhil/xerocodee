import React, {useState,useEffect} from 'react';
import './HostingSelection.css';
import HostingOption from '../HostingOptions/HostingOption';
import axios from 'axios';
function HostingSelection(props) {
    const [host,setHost] = useState("")
    const [hostOptionSelector, setHostOptionSelector] = useState(false)
    const UpdateDB = (field,value) => {
        var config = {
            method: 'put',
            url: process.env.REACT_APP_BACKEND_URL+`/update?field=${field}&value=${value}`,
            headers: { 
              'Authorization': 'Bearer '+props.token, 
            }
          };
          
          axios(config)
          .then(function (response) {
            console.log(JSON.stringify(response.data.data));
          })
          .catch(function (error) {
            
            if(error.response.code === 401){
                window.location.href = '/login';
            }
        });
    }
    useEffect(()=>{
        if(host == "Self Hosting"){
        setHostOptionSelector(true)
        UpdateDB('hosting',host)
        }else if(host === "XeroCodee Hosting"){
            setHostOptionSelector(false)
            UpdateDB('hosting',host)
        }
        else{
            setHostOptionSelector(false)
        }
    },[host])
    return (
        <div className='hosting-selection-box'>
            <div className="title-container">
                    <div className="horizontal-line"></div>
                    <p className="choose-text">Choose from the following Deployment Types</p>
                    <div className="horizontal-line"></div>
            </div>
            { hostOptionSelector ? <HostingOption token={props.token} /> : (
                        <div className="detail-box_button-container">
                                <button className="detail-box_button" onClick={() => setHost("Self Hosting")}>Self Hosting</button>
                                <button className="detail-box_button" onClick={() => setHost("XeroCodee Hosting")}>XeroCodee Hosting</button>
                        </div>
            )}
        </div>
    );
}

export default HostingSelection;