import * as dynamodb from "../../utils/dynamodb";
import uuid from "uuid";
import { success, failure } from "../../utils/http";

export async function main(event, context) {
  const data = JSON.parse(event.body);
  console.log('event.requestContext.identity = ', event.requestContext.identity);
  const params = {
    TableName: process.env.helpTableName,
    Item: {
      helpId: uuid.v1(),
      userId: event.requestContext.identity.cognitoIdentityId,
      isOffer: data.isOffer,
      region: data.region,
      asigneeFullName: ' ',
      asigneePhoneNumber: ' ',
      city: data.city,
      state: data.state,
      description: data.description,
      firstName: data.firstName,
      lastName: data.lastName,
      neighbourhood: data.neighbourhood,
      phoneNumber: data.phoneNumber,
      status: data.isOffer == 'true' ? ' ' : 'unassigned',
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
