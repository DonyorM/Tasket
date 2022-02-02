import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { Fragment, useState } from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { useParams } from "react-router-dom";
import { IconButton, LinkButton } from "../components/Button";
import ConfirmDialog from "../components/ConfirmDialog";
import Loading from "../components/Loading";
import withAuth, { AuthProps } from "../components/withAuth";
import { GroupHistory } from "../utilities/types";
dayjs.extend(customParseFormat);

const db = getFirestore();

function GroupHistoryView({ user }: AuthProps) {
  const { groupId } = useParams();
  const [historyDoc, historyLoading, historyError] = useDocument(
    doc(db, "history", groupId ?? "")
  );
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [taskToUpdateCoords, setTaskToUpdateCoords] = useState([-1, -1]);

  if (historyLoading) {
    return <Loading />;
  }

  if (!historyDoc || historyError) {
    return (
      <div className="text-center">
        <p className="text-xl text-center m-2">
          No history for this group found.
        </p>
        <LinkButton to={`/group/${groupId}`}>Back To Group Page</LinkButton>
      </div>
    );
  }

  const data = historyDoc.data() as GroupHistory;
  const previousWeeks = [...data.previousWeeks].reverse();
  const mostRecent = previousWeeks[0];

  function markComplete() {
    const [weekNum, taskNum] = taskToUpdateCoords;
    previousWeeks[weekNum].tasks[taskNum].completed = true;
    const newData = { ...data };
    newData.previousWeeks = [...previousWeeks].reverse();
    if (!historyDoc?.ref) {
      console.error("History doc ref couldn't be found?");
      return;
    }
    setDoc(historyDoc?.ref, newData);
  }

  if (!mostRecent) {
    <div className="text-center">
      <p className="text-xl text-center m-2">
        No history for this group yet! Check back next week!
      </p>
      <LinkButton to={`/group/${groupId}`}>Back To Group Page</LinkButton>
    </div>;
  }

  return (
    <div className="p-2">
      <LinkButton to={`/group/${groupId}`}>Back</LinkButton>
      <h2 className="text-center text-4xl mb-2">{mostRecent.name}</h2>
      <div className="grid grid-cols-[1fr_1fr_1fr_2em] divide-x divide-y divide-gray-200/10 ring-1 ring-gray-200 rounded-md text-center">
        <span className="font-bold">Task Name</span>
        <span className="font-bold">Assigned Member</span>
        <span className="font-bold">Complete</span>
        <span className=""></span>
        {previousWeeks.map((week, index) => {
          const startDate = dayjs(week.currentStartDate, "YYYY-MM-DD");
          return (
            <Fragment key={index}>
              <span className="col-span-full ring-1 ring-gray-200">
                Week of {startDate.format("MM/DD/YY")}
              </span>
              {week.tasks.map((task, taskIndex) => {
                return (
                  <Fragment key={taskIndex}>
                    <span className="break-words">{task.name}</span>
                    <span className="break-words">
                      {task.assignedName || task.assignedId || "Not assigned"}
                    </span>
                    <span>{task.completed ? "Completed" : "Incomplete"}</span>
                    {!task.completed && task.assignedId === user.email ? (
                      <span className="flex items-center justify-center">
                        <IconButton
                          onClick={() => {
                            setTaskToUpdateCoords([index, taskIndex]);
                            setShowConfirmDialog(true);
                          }}
                        >
                          <FontAwesomeIcon icon={faCheck} />
                        </IconButton>
                      </span>
                    ) : (
                      <span></span>
                    )}
                  </Fragment>
                );
              })}
            </Fragment>
          );
        })}
      </div>
      <ConfirmDialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={markComplete}
        description="Are you sure you want to mark this task complete retroactively?"
      />
    </div>
  );
}

export default withAuth(GroupHistoryView);
