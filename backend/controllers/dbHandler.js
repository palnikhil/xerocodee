let dbHandler = new Object();
let dbController = require('../db/dbController');
const appHelper = require('../helpers/appHelper');
dbHandler.updateRecord = async (req) =>{
    try{
        const {field,value} = req.query;
        const {user_id} = req.user
        console.log(user_id)
        console.log(field,value)
        if(!field || !value){
            return appHelper.apiResponse(500, false, 'Error in DB operation');
        }
        let update;
        
        update = await dbController.updateField(user_id,field,value);

        console.log(update)
        if(update.success === false){
            return appHelper.apiResponse(500, false, 'Error in DB operation');
        }
        update.data.password = undefined;
        return appHelper.apiResponse(200, true, ' Updation Successfull', update.data);
    }catch(err){
        console.log(err.message?err.message:err);
        appHelper.apiResponse(500, false, "Internal Server Error");
    }
}

module.exports = dbHandler