const AWS = require('aws-sdk');
const config = require('./config/config');

AWS.config.update(config.aws_remote_config);
const docClient = new AWS.DynamoDB.DocumentClient();
const DB = new AWS.DynamoDB();

const addMovie = () => {

    var params = {
        TableName: "userInfo",
        Item:{
        user_id: "wqwqewewfefes",
        username: "nikhilpal9113",
        email: "nikhilpal9111@gmail.com"
    }
    };

    // Call DynamoDB to add the item to the table
    docClient.put(params, function (err, data) {
        if (err) {
            console.log({
                success: false,
                message: err
            });
        } else {
            console.log({
                success: true,
                message: 'Added movie',
                movie: data
            });
        }
    });
}

const getMovies = function (req, res) {

    const params = {
        TableName: "userInfo"
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
}

const queryTable = () => {
    const params = {
      TableName: 'userInfo',
      FilterExpression: 'username = :username', // Condition for partition key
      ExpressionAttributeValues: {
        ':username': 'nikhilpal9111', // Replace with the actual user_id value
      },
    };
  
    docClient.scan(params, (err, data) => {
      if (err) {
        console.error('Error querying table:', err);
      } else {
        console.log('Query result:', data.Items);
      }
    });
};

const updateField = () => {
    const params = {
      TableName: 'userInfo',
      Key: {
        user_id: 'wqwqewewfefef', // Replace with the actual user_id value
        username: 'nikhilpal9111', // Replace with the actual username value
      },
      UpdateExpression: 'SET email = :newEmail', // Update the email attribute
      ExpressionAttributeValues: {
        ':newEmail': 'nikomreaders@example.com', // Replace with the new email value
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

updateField();
//queryTable();
//addMovie()
//getMovies()