const axios = require('axios');
let ghcontroller = new Object();
ghcontroller.getRepos = async (username) => {
    try{
        const response = await axios.get(`https://api.github.com/users/${username}/repos`);
        if (response.status === 200) {
            const repos = response.data;
            const repoNames = repos.map((repo) => repo.name);
        
            return { code:200,status: true, data: repoNames,message:"Retrieved Successfully"}
          } else {
            return {code:500,status: false, message: "Something Error"}
          }
    }catch(err){
        return {code:500,status: false, message: err.message? err.message:err}
    }
};

module.exports = ghcontroller;