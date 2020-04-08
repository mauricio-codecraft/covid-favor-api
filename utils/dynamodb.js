// import AWS from "aws-sdk";
var dbClient = require('serverless-dynamodb-client');

export const call = (action, params, stage) => {
  const dynamoDb = dbClient.doc;
  return dynamoDb[action](params).promise();
};