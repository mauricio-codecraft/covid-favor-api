// import AWS from "aws-sdk";
var dbClient = require('serverless-dynamodb-client');

export const call = (action, params, stage) => {
  const dynamoDb = dbClient.doc;
  console.log('dynamoDb = ', dynamoDb);
  return dynamoDb[action](params).promise();
};