import React,{useState} from 'react';
import DataTable from '../../Table/Datatable';
import axios from 'axios';

const HostingOption = (props) => {

    const [activateInput, setActivateInput] = useState(false);
    const [github,setGithub] = useState("")
    const [tableActive, setTableActive] = useState(false)
    const [message, setMessage] = useState("");
    const [data, setData] = useState([])
    const getRepos =()=>{
        var config = {
            method: 'get',
            url: process.env.REACT_APP_BACKEND_URL+`/getGithubrepos/${github}`,
            headers: { 
              'Authorization': 'Bearer '+props.token, 
            }
          };
          
          axios(config)
          .then(function (response) {
            console.log(JSON.stringify(response.data.data));
            setMessage(response.data.message);
            setData(response.data.data)
            setTableActive(true)
          })
          .catch(function (error) {
            setMessage(error.response.data.message)
            if(error.response.code === 401){
                window.location.href = '/login';
            }
        });
    }
    return (
            <div>
                <div className="detail-box_button-container">
                        <button className="detail-box_button" onClick={() => setActivateInput(true)}>Github</button>
                        <button className="detail-box_button" onClick={()=> setActivateInput(false)}>AWS Cloud</button>
                </div>
                { message? <p className='message'>{message}</p>:null}
                {activateInput && (
                    <div className="input-box">
                        <input className="text-input-box" type="text" placeholder="Github Username"  value={github}
                        onChange={(e) => setGithub(e.target.value)}/>
                        <button onClick={getRepos}>Submit</button>
                    </div>
                    
                ) }
                { tableActive ? <DataTable data={data}/>:null}
            </div>

    );
};

export default HostingOption;