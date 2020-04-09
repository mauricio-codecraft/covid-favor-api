import * as dynamodb from "../../utils/dynamodb";
import { success, failure } from "../../utils/http";

export async function main(event, context) {
  let data = JSON.parse(event.body);
  console.log('data = ', data);
  let loggedUserId = event.requestContext.identity.cognitoIdentityId;
  console.log('loggedUserId = ', loggedUserId);
  let selectedHelpUserId = data.selectedHelpUserId;
  console.log('selectedHelpUserId = ', selectedHelpUserId);
  let createdAt = Number(data.createdAt);
  console.log('createdAt = ', createdAt);
  let asigneeFullName = data.asigneeFullName;
  console.log('asigneeFullName = ', asigneeFullName);
  let asigneePhoneNumber = data.asigneePhoneNumber;
  console.log('asigneePhoneNumber = ', asigneePhoneNumber);

  // TODO: Check the possibility for using the helpId as a condition expression
  if (selectedHelpUserId != loggedUserId) {
    const params = {
      TableName: process.env.helpTableName,
      Key: {
        region: data.region,
        createdAt: createdAt
      },
      ConditionExpression: "userId = :userId",
      UpdateExpression: "set #status = :status, asigneeFullName = :asigneeFullName, asigneePhoneNumber = :asigneePhoneNumber",
      ExpressionAttributeNames: { "#status": "status" },
      ExpressionAttributeValues: {
        ":status": "assigned",
        ":asigneeFullName": asigneeFullName,
        ":asigneePhoneNumber": asigneePhoneNumber,
        ":userId": selectedHelpUserId
      }
    };
    try {
      console.log('before update with params = ', params);
      await dynamodb.call("update", params);
      return success({ status: true });
    } catch (e) {
      console.error(e);
      return failure({ status: false });
    }
  } else {
    console.log('logged user is the help owner');
    return failure({ status: false });
  }
}