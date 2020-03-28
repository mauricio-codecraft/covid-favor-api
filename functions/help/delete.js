import * as dynamodb from "../../utils/dynamodb";
import { success, failure } from "../../utils/http";

export async function main(event, context) {
  console.log('event = ', event);
  let data = event.queryStringParameters;
  console.log('data = ', data);
  let loggedUserId = event.requestContext.identity.cognitoIdentityId;
  console.log('loggedUserId = ', loggedUserId);
  let selectedHelpUserId = data.selectedHelpUserId;
  console.log('selectedHelpUserId = ', selectedHelpUserId);
  let createdAt = Number(data.createdAt);
  console.log('createdAt = ', createdAt);

  if (selectedHelpUserId == loggedUserId) {
    const params = {
      TableName: process.env.helpTableName,
      Key: {
        region: data.region,
        createdAt: createdAt
      },
    };
    try {
      console.log('before delete with params = ', params);
      await dynamodb.call("delete", params);
      return success({ status: true });
    } catch (e) {
      console.error(e);
      return failure({ status: false });
    }
  } else {
    console.log('logged user is not the help owner');
    return failure({ status: false });
  }

}