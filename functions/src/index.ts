import * as functions from "firebase-functions";
import { groupCreate } from "./data_mangement/groups";
import admin = require("firebase-admin");

admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export const createGroup = functions.firestore
  .document("groups/{docId}")
  .onCreate(groupCreate);
