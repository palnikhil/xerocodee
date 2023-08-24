import React,{useState} from 'react';

const HostingOption = () => {
    const [activateInput, setActivateInput] = useState(false)
    return (
            <div>
                <div className="detail-box_button-container">
                        <button className="detail-box_button" onClick={() => setActivateInput(true)}>Github</button>
                        <button className="detail-box_button" onClick={()=> setActivateInput(false)}>AWS Cloud</button>
                </div>
                {activateInput && (
                    <div className="input-box">
                        <input className="text-input-box" type="text" placeholder="Github Repository" />
                        <button>Submit</button>
                    </div>
                ) }
            </div>

    );
};

export default HostingOption;