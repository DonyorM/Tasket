import { Group, GroupHistory, Member } from "../types/types";
import { getUserName } from "../utilities/users";
import { rotateGroupTasks } from "../utilities/groupUtilities";
import {
  getFirestore,
  QueryDocumentSnapshot,
  WriteResult,
} from "firebase-admin/firestore";
import dayjs = require("dayjs");
import { convertDayToDate } from "../types/DueDate";
import { sendMessage } from "../utilities/mail";
import * as functions from "firebase-functions";
type DocumentReference = FirebaseFirestore.DocumentReference;

const NO_NAME = "Person Not In System";
const MAX_WEEKS_HISTORY = 104;
const db = getFirestore();

/**
 * Updates the specified group with the passed values
 * @param group
 * @param ref
 */
async function updateGroup(
  group: Group,
  ref: DocumentReference
): Promise<void> {
  await ref.set(group);
}

export async function addMemberToGroup(
  groupId: string,
  memberEmail: string
): Promise<void> {
  const name = await getUserName(memberEmail);
  const groupRef = db.collection("groups").doc(groupId);
  const groupDoc = await groupRef.get();
  if (groupDoc.exists) {
    const group = groupDoc.data() as Group;
    group.memberEmails = [...group.memberEmails, memberEmail];
    group.members = [...group.members, { id: memberEmail, name: name }];
    groupRef.set(group);
  }
}

/**
 * Automatically update the names in newly created groups to take into account people already in the
 * system. Emails not yet registered are not changed. This is not meant to be called directly but
 * is attached to a listener
 * @param snapshot
 * @param context
 * @returns
 */
export async function groupCreate(
  snapshot: FirebaseFirestore.QueryDocumentSnapshot
): Promise<void> {
  if (snapshot.exists) {
    const dataVal = snapshot.data();
    if (!dataVal) {
      return;
    }
    const data = dataVal as Group;
    let changed = false;
    await Promise.all(
      data.members.map(async (mem: Member) => {
        if (!mem.name || mem.name == NO_NAME) {
          const name = await getUserName(mem.id);
          changed = true;
          mem.name = name;
        }
      })
    );
    if (changed) {
      updateGroup(data as Group, snapshot.ref);
    }
  }
}

async function assignTasksInternal(
  groupRef: DocumentReference,
  data: Group
): Promise<Group> {
  const newGroup = rotateGroupTasks(data);
  await groupRef.set(newGroup);
  return newGroup;
}
export async function assignTasks(groupId: string): Promise<Group> {
  const groupRef = db.collection("groups").doc(groupId);
  const doc = await groupRef.get();
  if (doc.exists) {
    const data = doc.data() as Group;
    return await assignTasksInternal(groupRef, data);
  } else {
    throw Error("Group could not be found. ID: " + groupId);
  }
}

async function saveHistory(
  doc: QueryDocumentSnapshot,
  groupData?: Group
): Promise<WriteResult> {
  if (doc.exists) {
    const group = groupData || (doc.data() as Group);
    const groupHistoryRef = db.collection("history").doc(doc.id);
    const historyDoc = await groupHistoryRef.get();
    if (historyDoc.exists) {
      const historyData = historyDoc.data() as GroupHistory;
      let existingHistory = historyData.previousWeeks;
      if (existingHistory.length >= MAX_WEEKS_HISTORY) {
        existingHistory = existingHistory.slice(1, MAX_WEEKS_HISTORY);
      }
      existingHistory.push(group);
      historyData.previousWeeks = existingHistory;
      return await groupHistoryRef.set(historyData);
    } else {
      return await groupHistoryRef.set({
        groupId: doc.id,
        previousWeeks: [group],
      });
    }
  } else {
    throw Error("Could not find group " + doc.id);
  }
}

export async function sendNewTaskEmails(group: Group): Promise<void[]> {
  const startDate = dayjs(group.currentStartDate, "YYYY-MM-DD", true);
  return Promise.all(
    group.members.map(async (member) => {
      const memberTasks = group.tasks.filter((x) => x.assignedId === member.id);
      const plural = memberTasks.length == 1;
      const memberText = memberTasks
        .map(
          (x) =>
            `${x.name}: due ${convertDayToDate(x.dueDate, startDate).format(
              "MM/DD"
            )}`
        )
        .join("\n");
      if (memberTasks) {
        const message = `Hello ${member.name},
        
        Your ${plural ? "tasks" : "task"} for ${group.name} ${
          plural ? "are" : "is"
        }:
        ${memberText}`;
        return await sendMessage(member.id, `Tasks for ${group.name}`, message);
      }
    })
  );
}

export async function sendReminderEmails(group: Group): Promise<void[]> {
  return Promise.all(
    group.tasks.map(async (task) => {
      if (task.completed || !task.assignedId) {
        return;
      }
      const now = dayjs();
      const tomorrowDayNumber = now.day() === 6 ? 0 : now.day() + 1;
      if ((task.dueDate as number) == tomorrowDayNumber) {
        const message = `Hello ${task.assignedName},
        
        Your task ${task.name} for group ${group.name} is due tomorrow, don't forget to finish it!`;

        sendMessage(task.assignedId, "Task Due Soon!", message);
      }
    })
  );
}

export async function dailyRotation(): Promise<void> {
  const snapshot = await db.collection("groups").get();
  snapshot.forEach(async (doc) => {
    let group = doc.data() as Group;
    functions.logger.info(
      "Running daily rotation for group",
      doc.id,
      "with name",
      group.name
    );
    if (group.resetDay == dayjs().day()) {
      await saveHistory(doc, group);
      group.currentStartDate = dayjs().format("YYYY-MM-DD");
      group = await assignTasksInternal(doc.ref, group);
      await sendNewTaskEmails(group);
    } else {
      sendReminderEmails(group);
    }
  });
}
