import uuid from "uuid";
import * as dynamodb from "../../utils/dynamodb";
import { success, failure } from "../../utils/http";

export async function main(event, context) {
  const data = JSON.parse(event.body);
  console.log('event.requestContext.identity = ', event.requestContext.identity);
  const params = {
    TableName: process.env.offerTableName,
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      offerId: uuid.v1(),
      description: data.description,
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      city: data.city,
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
