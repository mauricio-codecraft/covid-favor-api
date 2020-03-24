import * as dynamodb from "../../utils/dynamodb";
import { success, failure } from "../../utils/http";

export async function main(event, context) {
  const params = {
    TableName: process.env.userAccountTableName,
    // 'Key' defines the partition key and sort key of the item to be retrieved
    // - 'userId': Identity Pool identity id of the authenticated user
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId
    }
  };

  try {
    const result = await dynamodb.call("get", params);
    if (result.Item) {
      // Return the retrieved item
      return success(result.Item);
    } else {
      return failure({ status: false, error: "Item not found." });
    }
  } catch (e) {
    return failure({ status: false });
  }
}