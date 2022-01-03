import { doc, getFirestore } from "@firebase/firestore";
import { Fragment } from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { useParams } from "react-router";
import { Button } from "../components/Button";
import Loading from "../components/Loading";
import withAuth, { AuthProps } from "../components/withAuth";
import { convertDayToDate } from "../utilities/DueDate";
import { Group, Task } from "../utilities/types";
import NotFound from "./NotFound";
import { getFunctions, httpsCallable } from "firebase/functions";
const db = getFirestore();
const functions = getFunctions();
const rotateTasks = httpsCallable(functions, "rotateTasks");

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

  const isAdmin = groupData.admin === user.email;

  function buildUserRow(userId: string) {
    const userTasks = groupData.tasks.filter((x) => x.assignedId === userId);
    if (userTasks) {
      return (
        <Fragment key={userId}>
          {userTasks.map((task, index) => {
            <Fragment key={index}>
              <span>{task.assignedName || task.assignedId}</span>
              <span>{task.name}</span>
              <span>{task.completed ? "Complete" : "Incomplete"}</span>
              <span>
                {convertDayToDate(task.dueDate).toLocaleDateString(undefined, {
                  month: "2-digit",
                  day: "2-digit",
                })}
                ;
              </span>
            </Fragment>;
          })}
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

  function reassignTasks() {
    rotateTasks({ groupId: groupDoc?.id });
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
      <div>
        {isAdmin ? <Button onClick={reassignTasks}>Reassign Tasks</Button> : ""}
      </div>
    </>
  );
}

export default withAuth(ViewGroup);
