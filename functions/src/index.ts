import * as functions from "firebase-functions";
import { initializeApp } from "firebase-admin/app";
import * as groupManagement from "./data_mangement/groups";

initializeApp();

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

export const rotateTasks = functions.https.onCall(({ groupId }) => {
  groupManagement.assignTasks(groupId);
});
