import * as dynamodb from "../../utils/dynamodb";
import { success, failure } from "../../utils/http";

export async function main(event, context) {
  console.log('event = ', event);
  let data = event.queryStringParameters;
  let onlyMyItems = data.onlyMyItems == 'true';
  let region = data.region;
  let state = data.state;
  let params;
  if (onlyMyItems == true) {
    console.log('Inside if');
    params = {
      TableName: process.env.helpTableName,
      KeyConditionExpression: '#region = :region',
      ExpressionAttributeNames: { "#region": "region" },
      FilterExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':region': region,
        ':userId': event.requestContext.identity.cognitoIdentityId
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
  } else {
    // TODO: query for offers or requests that are not mine
    // let isOffer = data.isOffer == 'true';
    params = {
      TableName: process.env.helpTableName,
      KeyConditionExpression: '#region = :region',
      ExpressionAttributeNames: { "#region": "region" },
      FilterExpression: 'userId <> :userId',
      ExpressionAttributeValues: {
        ':region': region,
        ':userId': event.requestContext.identity.cognitoIdentityId
      },
      ScanIndexForward: false
    };
    try {
      console.log('query for other users items in same region with params = ', params);
      let result = await dynamodb.call("query", params);
      let helpItems = result.Items;
      console.log('helpItems = ', helpItems);
      if (Array.isArray(helpItems) && helpItems.length <= 0) {
        params = {
          TableName: process.env.helpTableName,
          FilterExpression: 'userId <> :userId and #state = :state',
          ExpressionAttributeNames: { "#state": "state" },
          ExpressionAttributeValues: {
            ':userId': event.requestContext.identity.cognitoIdentityId,
            ':state': state,
          },
          ScanIndexForward: false
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
}
