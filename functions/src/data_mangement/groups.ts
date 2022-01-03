import { Group, Member } from "../types/types";
import { getUserName } from "../utilities/users";
import { rotateGroupTasks } from "../utilities/groupUtilities";
import { getFirestore } from "firebase-admin/firestore";
type DocumentReference = FirebaseFirestore.DocumentReference;

const NO_NAME = "Person Not In System";
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

export async function assignTasks(groupId: string): Promise<void> {
  const groupRef = db.collection("groups").doc(groupId);
  const doc = await groupRef.get();
  if (doc.exists) {
    const data = doc.data() as Group;
    const newGroup = rotateGroupTasks(data);
    groupRef.set(newGroup);
  }
}
