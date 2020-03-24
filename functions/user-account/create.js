import * as dynamodb from "../../utils/dynamodb";
import { success, failure } from "../../utils/http";

export async function main(event, context) {
  const data = JSON.parse(event.body);
  console.log('event.requestContext.identity = ', event.requestContext.identity);
  const params = {
    TableName: process.env.userAccountTableName,
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      city: data.city,
      state: data.state,
      region: data.region,
      neighbourhood: data.neighbourhood,
      createdAt: Date.now()
    }
  };

  try {
    console.log('before put with params = ', params);
    await dynamodb.call("put", params);
    return success(params.Item);
  } catch (e) {
    console.error(e);
    return failure({ status: false });
  }
}
