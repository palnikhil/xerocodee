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

dbController.updateField = async function(userId, customField,customValue) {
  const params = {
    TableName: tableName, // Replace with your table name
    Key: {
      user_id: userId
    },
    UpdateExpression: 'SET #customField = :customValue',
    ExpressionAttributeNames: {
      '#customField': customField
    },
    ExpressionAttributeValues: {
      ':customValue': customValue
    },
    ReturnValues: 'ALL_NEW' // Change to your preferred return values
  };

  try {
    const result = await docClient.update(params).promise();
    return {
      success: true,
      data: result.Attributes
    };
  } catch (error) {
    console.error('Error updating field:', error);
    return {
      success: false,
      message: 'Error updating field'
    };
  }
}


module.exports = dbController;