import stripePackage from "stripe";
import { noteStorageCost } from "../../utils/billing";
import { success, failure } from "../../utils/http";

export async function main(event, context) {
  const { notesQty, source } = JSON.parse(event.body);
  const amount = noteStorageCost(notesQty);
  const description = "Scratch charge";

  // Load our secret key from the  environment variables
  const stripe = stripePackage(process.env.stripeSecretKey);

  try {
    await stripe.charges.create({
      source,
      amount,
      description,
      currency: "usd"
    });
    return success({ status: true });
  } catch (e) {
    return failure({ message: e.message });
  }
}