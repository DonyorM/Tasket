import * as firebaseAdmin from "firebase-admin";

export async function getUserName(email: string): Promise<string> {
  const userRecord = await firebaseAdmin.auth().getUserByEmail(email);

  if (userRecord) {
    return userRecord.displayName ?? "";
  } else {
    return "";
  }
}
