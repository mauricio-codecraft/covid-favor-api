import * as dynamodb from "../../utils/dynamodb";
import { success, failure } from "../../utils/http";

export async function main(event, context) {
  console.log('event = ', event);
  let data = event.queryStringParameters;
  let onlyMyItems = data.onlyMyItems == 'true';
  let region = data.region;
  let userId = event.requestContext.identity.cognitoIdentityId;
  if (onlyMyItems == true) {
    return retrieveMyHelpItems(userId, region);
  } else {
    let state = data.state;
    let isOffer = (data.isOffer == 'true');
    return retrieveOthersHelpItems(userId, isOffer, state, region);
  }
}

async function retrieveMyHelpItems(userId, region) {
  let params = {
    TableName: process.env.helpTableName,
    KeyConditionExpression: '#region = :region',
    ExpressionAttributeNames: { "#region": "region" },
    FilterExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':region': region,
      ':userId': userId
    },
    ScanIndexForward: false
  };
  try {
    console.log('query with params = ', params);
    let result = await dynamodb.call("query", params);
    return success(result.Items);
  } catch (e) {
    console.error(e);
    return failure({ status: false });
  }
}

async function retrieveOthersHelpItems(userId, isOffer, state, region) {
    let params = {
      TableName: process.env.helpTableName,
      KeyConditionExpression: '#region = :region',
      ExpressionAttributeNames: { "#region": "region" },
      FilterExpression: 'userId <> :userId and isOffer = :isOffer',
      ExpressionAttributeValues: {
        ':region': region,
        ':userId': userId,
        ':isOffer': isOffer
      },
      ScanIndexForward: false,
      Limit: 200
    };
    try {
      console.log('query for other users items in same region with params = ', params);
      let result = await dynamodb.call("query", params);
      let helpItems = result.Items;
      console.log('helpItems = ', helpItems);
      if (Array.isArray(helpItems) && helpItems.length <= 0) {
        params = {
          TableName: process.env.helpTableName,
          FilterExpression: 'userId <> :userId and #state = :state and isOffer = :isOffer',
          ExpressionAttributeNames: { "#state": "state" },
          ExpressionAttributeValues: {
            ':userId': userId,
            ':state': state,
            ':isOffer': isOffer
          },
          ScanIndexForward: false,
          Limit: 200
        };
        console.log('query for other users items in same state with params = ', params);
        let result = await dynamodb.call("scan", params);
        return success(result.Items);
      }
      return success(result.Items);
    } catch (e) {
      console.error(e);
      return failure({ status: false });
    }
}
