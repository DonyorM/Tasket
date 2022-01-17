import * as admin from "firebase-admin";
admin.initializeApp();
import * as functions from "firebase-functions";
import * as groupManagement from "./data_mangement/groups";
import * as customParseFormat from "dayjs/plugin/customParseFormat";
import * as dayjs from "dayjs";
import { getFirestore } from "firebase-admin/firestore";
dayjs.extend(customParseFormat);

const db = getFirestore();

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

export const manualGroupCreate = functions.https.onCall(async ({ groupId }) => {
  const snapshot = await db.doc(`groups/${groupId}`).get();
  groupManagement.groupCreate(snapshot);
});

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

export const scheuledRunDailyTasks = functions.pubsub
  .schedule("5 3 * * *")
  .timeZone("America/New_York")
  .onRun(async () => {
    functions.logger.info("Running daily tasks!");
    await groupManagement.dailyRotation();
    return null;
  });

export const manuallyRunDailyTasks = functions.https.onCall(
  groupManagement.dailyRotation
);

export const swapOutMember = functions.https.onCall(
  async ({ newEmail, oldEmail }) => {
    groupManagement.swapOutMember(newEmail, oldEmail);
  }
);
