import { Group } from "../types/types";

export function rotateGroupTasks(group: Group) {
  const returnGroup = { ...group };
  const currentOffset = group.currentOffset ?? 0;
  const extraTasks = group.memberEmails.length - group.tasks.length;
  let i = 0;
  let adjustment = 0;
  const newTasks = [...group.tasks];
  for (const task of newTasks) {
    let memberIndex = i + currentOffset + adjustment;
    if (memberIndex >= group.memberEmails.length) {
      memberIndex = memberIndex - group.memberEmails.length;
    }
    if (extraTasks != 0) {
      const skipCount = Math.ceil(
        group.memberEmails.length / Math.abs(extraTasks)
      );
      if (i % skipCount === 0) {
        if (extraTasks > 0) {
          i += 1;
          memberIndex += 1; // Skip certain members each time, but make it different each time
          if (memberIndex >= group.memberEmails.length) {
            memberIndex = memberIndex - group.memberEmails.length;
          }
        } else {
          adjustment -= 1; // Makes same user get two tasks in a row
        }
      }
    }
    task.assignedId = group.memberEmails[memberIndex];
    task.assignedName = group.members.filter(
      (x) => x.id === group.memberEmails[memberIndex]
    )[0]?.name;
    i += 1;
  }
  returnGroup.tasks = newTasks;
  if (currentOffset >= returnGroup.memberEmails.length - 1) {
    returnGroup.currentOffset = 0;
  } else {
    returnGroup.currentOffset = currentOffset + 1;
  }
  return returnGroup;
}
