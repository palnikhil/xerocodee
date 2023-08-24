import React,{useState} from "react";
import './ChooseDetail.css';
import logo from '../../assets/logo.png';
import HostingSelection from "./HostingSelection/HostingSelection";

function ChooseDetail(){
    const [inputActive,setInputActive] = useState(false);
    const [inputType, setInputType] = useState("");
    const [complete,setComplete] = useState(false);

    return(
            <div className="detail-box">
                <img src={logo} alt="logo"/>
                <p className="title-text">Welcome, Nikhil Pal</p>

                {complete ? <HostingSelection /> :
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
                                <input className="text-input-box" type="text" placeholder={`${inputType} Name`}/>
                                <button onClick={() => setComplete(true)}>Submit</button>
                            </div>
                        ) }
                    </div>
                    )
                }
            </div>
    );
}

export default ChooseDetail;