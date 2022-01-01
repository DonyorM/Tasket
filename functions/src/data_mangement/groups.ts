import { Group, Member } from "../types/types";
import { getUserName } from "../utilities/users";
type DocumentReference = FirebaseFirestore.DocumentReference;

const NO_NAME = "Person Not In System";

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
        if (mem.name == NO_NAME) {
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
