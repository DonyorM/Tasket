import { doc, getFirestore } from "@firebase/firestore";
import { Fragment } from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { useParams } from "react-router";
import Loading from "../components/Loading";
import withAuth, { AuthProps } from "../components/withAuth";
import { convertDayToDate } from "../utilities/DueDate";
import { Group, Task } from "../utilities/types";
import NotFound from "./NotFound";
const db = getFirestore();

function ViewGroup({ user }: AuthProps) {
  const { groupId } = useParams();
  const [groupDoc, groupLoading, groupError] = useDocument(
    doc(db, "groups", groupId ?? "")
  );
  if (!groupId) {
    return <NotFound />;
  }
  const groupData = groupDoc?.data() as Group;
  if (groupLoading) {
    return <Loading />;
  }

  const currentUserTask = groupData.tasks.filter(
    (x) => x.assignedId === user.email
  )[0];
  const otherTasks = groupData.tasks.filter((x) => x.assignedId !== user.email);

  function buildUserRow(userId: string) {
    const userTask = groupData.tasks.filter((x) => x.assignedId === userId)[0];
    if (userTask) {
      return (
        <Fragment key={userId}>
          <span>{userTask.assignedName || userTask.assignedId}</span>
          <span>{userTask.name}</span>
          <span>{userTask.completed ? "Complete" : "Incomplete"}</span>
          <span>{convertDayToDate(userTask.dueDate).format("MM/DD")}</span>
        </Fragment>
      );
    } else {
      const memberName = groupData.members.filter((x) => x.id === userId)[0];
      const name = memberName?.name || userId;
      return (
        <Fragment key={userId}>
          <span>{name}</span>
          <span className="col-span-3">No task. Enjoy the break!</span>
        </Fragment>
      );
    }
  }

  return (
    <>
      <h1 className="text-4xl text-center">{groupData.name}</h1>
      <div className="grid grid-cols-4 divide-x divide-y divide-gray-200/10 ring-1 ring-gray-200/10 rounded-md m-2 text-center">
        <h2 className="text-2xl text-center col-span-full">Tasks</h2>
        <span>Assigned</span>
        <span>Task</span>
        <span>Completed</span>
        <span>Due Date</span>
        {buildUserRow(user.email as string)}
        {groupData.memberEmails
          .filter((x) => x !== user.email)
          .map((email) => buildUserRow(email))}
      </div>
    </>
  );
}

export default withAuth(ViewGroup);
