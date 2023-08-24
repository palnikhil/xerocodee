import React, {useState,useEffect} from 'react';
import './HostingSelection.css';
import HostingOption from '../HostingOptions/HostingOption';
function HostingSelection() {
    const [host,setHost] = useState("")
    const [hostOptionSelector, setHostOptionSelector] = useState(false)

    useEffect(()=>{
        if(host == "XeroCodee Hosting"){
        setHostOptionSelector(true)
        }else{
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
            { hostOptionSelector ? <HostingOption /> : (
                        <div className="detail-box_button-container">
                                <button className="detail-box_button" onClick={() => setHost("Self Hosting")}>Self Hosting</button>
                                <button className="detail-box_button" onClick={() => setHost("XeroCodee Hosting")}>XeroCodee Hosting</button>
                        </div>
            )}
        </div>
    );
}

export default HostingSelection;