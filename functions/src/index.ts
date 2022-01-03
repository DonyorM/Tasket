import * as admin from "firebase-admin";
admin.initializeApp();
import * as functions from "firebase-functions";
import * as groupManagement from "./data_mangement/groups";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export const createGroup = functions.firestore
  .document("groups/{docId}")
  .onCreate(groupManagement.groupCreate);

export const rotateTasks = functions.https.onCall(async ({ groupId }) => {
  functions.logger.info("Rotating tasks for group", groupId);
  return await groupManagement.assignTasks(groupId);
});

export const addMemberToGroup = functions.https.onCall(
  async ({ groupId, memberId }) => {
    functions.logger.info(
      "Adding member with email",
      memberId,
      "to group",
      groupId
    );
    return await groupManagement.addMemberToGroup(groupId, memberId);
  }
);
