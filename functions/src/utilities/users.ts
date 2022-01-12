import * as firebaseAdmin from "firebase-admin";

export async function getUserName(email: string): Promise<string | null> {
  try {
    const userRecord = await firebaseAdmin.auth().getUserByEmail(email);

    if (userRecord) {
      return userRecord.displayName ?? "";
    } else {
      return null;
    }
  } catch {
    return null;
  }
}
