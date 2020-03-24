import * as dynamodb from "../../utils/dynamodb";
import { success, failure } from "../../utils/http";

export async function main(event, context) {
  const params = {
    TableName: process.env.tableName,
    // 'Key' defines the partition key and sort key of the item to be removed
    // - 'userId': Identity Pool identity id of the authenticated user
    // - 'noteId': path parameter
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: event.pathParameters.id
    }
  };

  try {
    await dynamodb.call("delete", params);
    return success({ status: true });
  } catch (e) {
    return failure({ status: false });
  }
}