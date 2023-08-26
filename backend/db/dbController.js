let dbController = new Object();
const AWS = require('aws-sdk');
const config = require('../config/config');
const tableName = config.app.TABLE_NAME;
AWS.config.update(config.aws_remote_config);
const docClient = new AWS.DynamoDB.DocumentClient();

dbController.addRecord = async (item) => {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: tableName,
      Item: item
    };

    docClient.put(params, (err, data) => {
      if (err) {
        console.log({
          success: false,
          message: err
        });
        resolve({
          success: false,
          message: err
        });
      } else {
        params.Item.password = undefined;
        console.log({
          success: true,
          message: 'Added User',
          user: params.Item
        });
        resolve({
          success: true,
          message: 'Added User',
          user: params.Item
        });
      }
    });
  });
};


dbController.getRecord = async function () {

    const params = {
        TableName: tableName
    };

    docClient.scan(params, function (err, data) {

        if (err) {
            console.log(err)
            console.log({
                success: false,
                message: err
            });
        } else {
            const { Items } = data;
            console.log({
                success: true,
                movies: Items
            });
        }
    });
};

dbController.queryTable = (email) => {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: tableName,
      FilterExpression: 'email = :email', // Condition for partition key
      ExpressionAttributeValues: {
        ':email': email, // Replace with the actual user_id value
      },
    };
  
    docClient.scan(params, (err, data) => {
        if (err) {
          console.log({
            success: false,
            message: err
          });
          resolve({
            success: false,
            message: err
          })
        } else {
          console.log({
            success: true,
            message: 'Retrieved Data',
            data: data.Items
          });
          resolve({
            success: true,
            message: 'Retrieved Data',
            data: data.Items
          })
        }
    });
  })
};

dbController.queryTableFromUsername = (username) => {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: tableName,
      FilterExpression: 'username = :username', // Condition for partition key
      ExpressionAttributeValues: {
        ':username': username, // Replace with the actual user_id value
      },
    };
  
    docClient.scan(params, (err, data) => {
        if (err) {
          console.log({
            success: false,
            message: err
          });
          resolve({
            success: false,
            message: err
          })
        } else {
          console.log({
            success: true,
            message: 'Retrieved Data',
            data: data.Items
          });
          resolve({
            success: true,
            message: 'Retrieved Data',
            data: data.Items
          })
        }
    });
  })
};

dbController.updateField = (user_id,username,field, fieldValue) => {
    const params = {
      TableName: tableName,
      Key: {
        user_id: user_id, // Replace with the actual user_id value
        username: username, // Replace with the actual username value
      },
      UpdateExpression: `SET ${field} = :newfield`, // Update the email attribute
      ExpressionAttributeValues: {
        'newfield' : fieldValue, // Replace with the new email value
      },
      ReturnValues: 'UPDATED_NEW', // Return the updated value
    };
  
    docClient.update(params, (err, data) => {
      if (err) {
        console.error('Error updating item:', err);
      } else {
        console.log('Updated item:', data);
      }
    });
};

module.exports = dbController;