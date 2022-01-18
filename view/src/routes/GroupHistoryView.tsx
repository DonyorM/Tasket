import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { doc, getFirestore } from "firebase/firestore";
import { Fragment } from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { useParams } from "react-router-dom";
import { LinkButton } from "../components/Button";
import Loading from "../components/Loading";
import { GroupHistory } from "../utilities/types";
dayjs.extend(customParseFormat);

const db = getFirestore();

function GroupHistoryView() {
  const { groupId } = useParams();
  const [historyDoc, historyLoading, historyError] = useDocument(
    doc(db, "history", groupId ?? "")
  );

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
  const mostRecent = data.previousWeeks[0];

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
      <div className="grid grid-cols-3 divide-x divide-y divide-gray-200/10 ring-1 ring-gray-200 rounded-md text-center">
        <span className="font-bold">Task Name</span>
        <span className="font-bold">Assigned Member</span>
        <span className="font-bold">Complete</span>
        {data.previousWeeks.map((week, index) => {
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
                  </Fragment>
                );
              })}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default GroupHistoryView;
