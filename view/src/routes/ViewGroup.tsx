import { doc, getFirestore, setDoc } from "@firebase/firestore";
import { Fragment, useState } from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { useParams } from "react-router";
import { Button, IconButton, LinkButton } from "../components/Button";
import Loading from "../components/Loading";
import withAuth, { AuthProps } from "../components/withAuth";
import DueDate, { convertDayToDate } from "../utilities/DueDate";
import { Group, Member, Task } from "../utilities/types";
import NotFound from "./NotFound";
import { getFunctions, httpsCallable } from "firebase/functions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMinusCircle,
  faPen,
  faUserMinus,
} from "@fortawesome/free-solid-svg-icons";
import TasketDialog from "../components/TasketDialog";
import FloatingLabelInput from "../components/FloatingLabelInput";
import Select from "../components/Select";
import dayjs from "dayjs";
import { useSmMediaMatch } from "../utilities/useMediaMatch";
import ConfirmDialog from "../components/ConfirmDialog";
import { group } from "console";
const db = getFirestore();
const functions = getFunctions();
const rotateTasks = httpsCallable(functions, "rotateTasks");
const addMemberToGroup = httpsCallable(functions, "addMemberToGroup");

interface UserRowProps {
  tasks: Task[] | undefined;
  userEmail: string;
  memberName?: string | null;
  editTask: (task: Task) => void;
  removeUser: (user: Member) => void;
  isAdmin?: boolean;
}

function UserRow({
  tasks,
  userEmail,
  memberName,
  removeUser,
  editTask,
  isAdmin,
}: UserRowProps) {
  if (tasks && tasks?.length > 0) {
    return (
      <Fragment>
        {tasks.map((task, index) => {
          const relativeDueDate = convertDayToDate(task.dueDate);
          const beginningOfNextDay = relativeDueDate.add(1, "day");
          let completedText = task.completed ? "Complete" : "Incomplete";
          if (dayjs().isAfter(beginningOfNextDay)) {
            completedText = "Overdue";
          }
          return (
            <Fragment key={index}>
              <span className="break-words">
                {task.assignedName || task.assignedId}
              </span>
              <span className="break-words">{task.name}</span>
              <span>{completedText}</span>
              <span>{relativeDueDate.format("MM/DD")}</span>
              {isAdmin ? (
                <Fragment>
                  <span className="col-span-2 sm:col-span-1 flex justify-center p-1">
                    <IconButton
                      onClick={() =>
                        removeUser({ id: userEmail, name: memberName })
                      }
                    >
                      <FontAwesomeIcon icon={faUserMinus} />
                    </IconButton>
                  </span>
                  <span className="col-span-2 sm:col-span-1 flex justify-center p-1">
                    <IconButton onClick={() => editTask(task)}>
                      <FontAwesomeIcon icon={faPen} />
                    </IconButton>
                  </span>
                </Fragment>
              ) : (
                ""
              )}
            </Fragment>
          );
        })}
      </Fragment>
    );
  } else {
    const name = memberName || userEmail;
    return (
      <Fragment>
        <span className="break-words">{name}</span>
        <span className="col-span-3 break-words">
          No task. Enjoy the break!
        </span>
        {isAdmin ? (
          <Fragment>
            <span className="col-span-2 sm:col-span-1 flex justify-center p-1">
              <IconButton
                onClick={() => removeUser({ id: userEmail, name: memberName })}
              >
                <FontAwesomeIcon icon={faUserMinus} />
              </IconButton>
            </span>
            <span className="col-span-2 sm:col-span-1 flex justify-center p-1"></span>
          </Fragment>
        ) : (
          ""
        )}
      </Fragment>
    );
  }
}

function ViewGroup({ user }: AuthProps) {
  const { groupId } = useParams();
  const [groupDoc, groupLoading, groupError] = useDocument(
    doc(db, "groups", groupId ?? "")
  );
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [newMemberText, setNewMemberText] = useState("");
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState(DueDate.NoDueDate);
  const [removeUserConfirmation, setRemoveUserConfirmation] =
    useState<Member | null>(null);
  const [removeTaskConfirmation, setRemoveTaskConfirmation] =
    useState<Task | null>(null);
  const [taskEditIndex, setTaskEditIndex] = useState(-1);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const isSmall = useSmMediaMatch();
  if (!groupId) {
    return <NotFound />;
  }
  const groupData = groupDoc?.data() as Group;
  if (groupLoading) {
    return <Loading />;
  }

  const isAdmin = groupData.admin === user.email;

  function reassignTasks() {
    rotateTasks({ groupId: groupDoc?.id });
  }

  function markComplete() {
    const newGroup = { ...groupData };
    const newTasks = [...newGroup.tasks];
    newGroup.tasks = newTasks;
    newTasks
      .filter((x) => x.assignedId === user.email)
      .forEach((x) => (x.completed = true));
    const ref = groupDoc?.ref;
    if (ref) {
      setDoc(ref, newGroup);
    }
  }

  function removeUser(toRemove: string) {
    const newGroup = { ...groupData };
    const newMembers = newGroup.members.filter((x) => x.id !== toRemove);
    newGroup.members = newMembers;
    newGroup.memberEmails = newGroup.memberEmails.filter((x) => x !== toRemove);
    newGroup.tasks = newGroup.tasks.map((task) => {
      if (task.assignedId === toRemove) {
        const newTask = { ...task };
        delete newTask.assignedId;
        delete newTask.assignedName;
        return newTask;
      } else {
        return task;
      }
    });
    const ref = groupDoc?.ref;
    if (ref) {
      setDoc(ref, newGroup);
    }
  }

  function removeTask(toRemove: string) {
    const newGroup = { ...groupData };
    newGroup.tasks = newGroup.tasks.filter((x) => x.name !== toRemove);
    const ref = groupDoc?.ref;
    if (ref) {
      setDoc(ref, newGroup);
    }
  }

  function addMember() {
    // TODO handle errors to adding member and loading
    addMemberToGroup({
      groupId: groupDoc?.id,
      memberId: newMemberText,
    });
    setNewMemberText("");
    setShowAddMemberDialog(false);
  }

  function addTask() {
    // TODO handle errors to adding member and loading
    const newGroup = { ...groupData };
    newGroup.tasks = [
      ...newGroup.tasks,
      {
        name: newTaskText,
        dueDate: newTaskDueDate,
      },
    ];
    const ref = groupDoc?.ref;
    if (ref) {
      setDoc(ref, newGroup);
    }
    setShowAddTaskDialog(false);
  }

  function editTask() {
    const newGroup = { ...groupData };
    const newTasks = [...newGroup.tasks];
    if (taskToEdit) {
      console.log("saving task");
      newTasks[taskEditIndex] = taskToEdit;
      newGroup.tasks = newTasks;
      const ref = groupDoc?.ref;
      if (ref) {
        console.log("saving task2");
        setDoc(ref, newGroup);
      }
      setTaskToEdit(null);
    }
  }

  return (
    <>
      <h1 className="text-4xl text-center">{groupData.name}</h1>
      <div className="flex place-content-between px-2 gap-2">
        <Button onClick={markComplete}>Mark Complete</Button>
        {isAdmin ? <Button onClick={reassignTasks}>Reassign Tasks</Button> : ""}
        <LinkButton to={`/group/${groupId}/history`}>View History</LinkButton>
      </div>
      <div
        className={`grid grid-cols-4 ${
          isAdmin ? "sm:grid-cols-[1fr_1fr_1fr_1fr_2em_2em]" : ""
        } divide-x divide-y divide-gray-200/10 ring-1 ring-gray-200/10 rounded-md m-2 text-center`}
      >
        <h2 className="text-2xl text-center col-span-full">Task Assignments</h2>
        <span className="font-bold">Assigned</span>
        <span className="font-bold">Task</span>
        <span className="font-bold">Completed</span>
        <span className="font-bold">Due Date</span>
        {isSmall && isAdmin ? (
          <>
            <span></span>
            <span></span>
          </>
        ) : (
          ""
        )}
        <UserRow
          tasks={groupData.tasks.filter(
            (x) => x.assignedId === (user.email as string)
          )}
          userEmail={user.email || ""}
          memberName={user.displayName}
          isAdmin={isAdmin}
          editTask={(task) => {
            setTaskEditIndex(groupData.tasks.indexOf(task));
            setTaskToEdit(task);
          }}
          removeUser={(member) => setRemoveUserConfirmation(member)}
        />
        {groupData.members
          .filter((x) => x.id !== user.email)
          .map((member) => (
            <UserRow
              key={member.id}
              tasks={groupData.tasks.filter((x) => x.assignedId === member.id)}
              userEmail={member.id}
              memberName={member.name}
              isAdmin={isAdmin}
              editTask={(task) => {
                setTaskEditIndex(groupData.tasks.indexOf(task));
                setTaskToEdit(task);
              }}
              removeUser={(member) => setRemoveUserConfirmation(member)}
            />
          ))}
      </div>
      {isAdmin ? (
        <div className="flex place-content-between px-2 gap-2">
          <Button onClick={() => setShowAddMemberDialog(true)}>
            Add Member
          </Button>
          <Button onClick={() => setShowAddTaskDialog(true)}>Add Task</Button>
        </div>
      ) : (
        ""
      )}
      <ConfirmDialog
        open={removeUserConfirmation !== null}
        title="Remove User?"
        description={`Are you sure you want to remove ${
          removeUserConfirmation &&
          (removeUserConfirmation.name || removeUserConfirmation.id)
        } from the group?`}
        onClose={() => setRemoveUserConfirmation(null)}
        onConfirm={() => removeUser(removeUserConfirmation?.id || "")}
      />
      <ConfirmDialog
        open={removeTaskConfirmation !== null}
        title="Remove User?"
        description={`Are you sure you want to remove task ${
          removeTaskConfirmation && removeTaskConfirmation.name
        } from the group?`}
        onClose={() => setRemoveTaskConfirmation(null)}
        onConfirm={() => removeTask(removeTaskConfirmation?.name || "")}
      />
      <TasketDialog
        open={showAddMemberDialog}
        onClose={() => setShowAddMemberDialog(false)}
        description="Add a new member to group"
      >
        <div>
          <FloatingLabelInput
            value={newMemberText}
            onValueChange={setNewMemberText}
          >
            Member Email
          </FloatingLabelInput>
          <div className="flex justify-end pt-2">
            <Button
              className="mx-2"
              onClick={() => setShowAddMemberDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={addMember}>Add</Button>
          </div>
        </div>
      </TasketDialog>
      <TasketDialog
        open={showAddTaskDialog}
        onClose={() => setShowAddTaskDialog(false)}
        description="Add a new task to group"
      >
        <div>
          <FloatingLabelInput
            value={newTaskText}
            onValueChange={setNewTaskText}
          >
            Task Name
          </FloatingLabelInput>
          <Select
            className="my-2"
            value={newTaskDueDate}
            onValueChange={setNewTaskDueDate}
          >
            <option value={DueDate.NoDueDate}>No Due Date</option>
            <option value={DueDate.Monday}>Monday</option>
            <option value={DueDate.Tuesday}>Tuesday</option>
            <option value={DueDate.Wednesday}>Wednesday</option>
            <option value={DueDate.Thursday}>Thursday</option>
            <option value={DueDate.Friday}>Friday</option>
            <option value={DueDate.Saturday}>Saturday</option>
            <option value={DueDate.Sunday}>Sunday</option>
          </Select>
          <div className="flex justify-end pt-2">
            <Button
              className="mx-2"
              onClick={() => setShowAddTaskDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={addTask}>Add</Button>
          </div>
        </div>
      </TasketDialog>
      <TasketDialog
        open={!!taskToEdit}
        onClose={() => setTaskToEdit(null)}
        title="Edit Task"
        description=""
      >
        <div>
          <FloatingLabelInput
            value={taskToEdit?.name}
            onValueChange={(value) => {
              const newTask = { ...taskToEdit } as Task;
              newTask.name = value;
              setTaskToEdit(newTask);
            }}
          >
            Task Name
          </FloatingLabelInput>
          <Select
            className="my-2"
            value={taskToEdit?.dueDate}
            onValueChange={(value) => {
              const newTask = { ...taskToEdit } as Task;
              newTask.dueDate = value;
              setTaskToEdit(newTask);
            }}
          >
            <option value={DueDate.NoDueDate}>No Due Date</option>
            <option value={DueDate.Monday}>Monday</option>
            <option value={DueDate.Tuesday}>Tuesday</option>
            <option value={DueDate.Wednesday}>Wednesday</option>
            <option value={DueDate.Thursday}>Thursday</option>
            <option value={DueDate.Friday}>Friday</option>
            <option value={DueDate.Saturday}>Saturday</option>
            <option value={DueDate.Sunday}>Sunday</option>
          </Select>
          <div className="flex justify-end pt-2">
            <Button
              className="mr-auto"
              onClick={() => removeTask(groupData.tasks[taskEditIndex]?.name)}
            >
              Delete Task
            </Button>
            <Button className="mx-2" onClick={() => setTaskToEdit(null)}>
              Cancel
            </Button>
            <Button onClick={editTask}>Save</Button>
          </div>
        </div>
      </TasketDialog>
    </>
  );
}

export default withAuth(ViewGroup);
