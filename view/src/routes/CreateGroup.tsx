import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { Fragment, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Button, IconButton } from "../components/Button";
import FloatingLabelInput from "../components/FloatingLabelInput";
import Select from "../components/Select";
import withAuth, { AuthProps } from "../components/withAuth";
import DueDate, {
  dueDateToString,
  getPreviousMonday,
} from "../utilities/DueDate";
import { Group, Member, Task } from "../utilities/types";

const db = getFirestore();

function CreateGroup({ user }: AuthProps) {
  const userEmail = user.email || "invalid user email";
  const [groupName, setGroupName] = useState("");
  const [resetDay, setResetDay] = useState(DueDate.Monday);
  const [members, setMembers] = useState<Member[]>([
    { id: userEmail, name: user.displayName || "No display name" },
  ]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newMember, setNewMemberValue] = useState("");
  const newMemberRef = useRef<HTMLInputElement>(null);
  const [taskName, setTaskName] = useState("");
  const [dueDate, setDueDate] = useState(DueDate.NoDueDate);
  const newTaskRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  async function createGroup() {
    const newGroup: Group = {
      name: groupName,
      resetDay: resetDay,
      tasks: tasks,
      members: members,
      admin: userEmail,
      memberEmails: members.map((x) => x.id),
      currentStartDate: getPreviousMonday().format("YYYY-MM-DD"),
    };

    const newDoc = await addDoc(collection(db, "groups"), newGroup);
    navigate(`/group/${newDoc.id}`);
  }

  function addMember() {
    const newMemberObj: Member = {
      id: newMember,
      name: null,
    };
    if (members.some((mem) => mem.id === newMemberObj.id)) {
      // TODO proper messaging for duplicates
      return;
    }
    const newMembersLists = [...members, newMemberObj];
    setMembers(newMembersLists);
    setNewMemberValue("");
    newMemberRef.current?.focus();
  }

  function removeMember(memberId: string) {
    const newMembersList = members.filter((x) => x.id !== memberId);
    setMembers(newMembersList);
  }

  function addTask() {
    const newTaskObj: Task = {
      name: taskName,
      dueDate: dueDate,
    };
    if (tasks.some((task) => task.name === newTaskObj.name)) {
      // TODO proper messaging for duplicates
      return;
    }
    const newTasksList = [...tasks, newTaskObj];
    setTasks(newTasksList);
    setTaskName("");
    setDueDate(DueDate.NoDueDate);
    newTaskRef.current?.focus();
  }

  function removeTask(taskName: string) {
    const newTasksList = tasks.filter((x) => x.name !== taskName);
    setTasks(newTasksList);
  }

  return (
    <Fragment>
      <div className="grid grid-cols-1 gap-2 p-2">
        <FloatingLabelInput
          type="text"
          name="group"
          onValueChange={setGroupName}
          value={groupName}
        >
          Group Name
        </FloatingLabelInput>
        <div className="flex items-center">
          <label htmlFor="resetDay" className="mx-2">
            Reset Day:
          </label>
          <Select
            name="resetDay"
            value={resetDay}
            onValueChange={setResetDay}
            className="flex-grow"
          >
            <option value={DueDate.Monday}>Monday</option>
            <option value={DueDate.Tuesday}>Tuesday</option>
            <option value={DueDate.Wednesday}>Wednesday</option>
            <option value={DueDate.Thursday}>Thursday</option>
            <option value={DueDate.Friday}>Friday</option>
            <option value={DueDate.Saturday}>Saturday</option>
            <option value={DueDate.Sunday}>Sunday</option>
          </Select>
        </div>
        <div className="grid grid-cols-[1fr_2.5rem] content-center items-center gap-x-2 mt-2">
          <span className="col-span-2 text-center text-xl">Members</span>
          <FloatingLabelInput
            type="text"
            name="newmember"
            value={newMember}
            onValueChange={setNewMemberValue}
            inputRef={newMemberRef}
            onEnterPress={addMember}
          >
            New Member Email
          </FloatingLabelInput>
          <IconButton
            width="h-8"
            height="w-8"
            className="rounded-full"
            onClick={() => addMember()}
          >
            <FontAwesomeIcon icon={faPlus} />
          </IconButton>
        </div>
        <div className="flex flex-col divide-y divide-gray-200/10 text-gray-300 ring-1 ring-gray-200/10 rounded-md my-2 mx-auto w-11/12">
          {members.length > 0 ? (
            members.map((member, index) => (
              <div
                className="flex place-content-between items-center"
                key={index}
              >
                <span className="inline-block mx-3">{member.id}</span>
                <button
                  className="inline-block mx-3"
                  onClick={() => removeMember(member.id)}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            ))
          ) : (
            <p className="text-center m-1">Add Some People To The Group!</p>
          )}
        </div>
        <div className="grid grid-cols-[1fr_1fr_2.5rem] content-center items-center gap-x-2 mt-2">
          <span className="col-span-3 text-center text-xl">Tasks</span>
          <FloatingLabelInput
            type="text"
            name="taskname"
            value={taskName}
            onValueChange={setTaskName}
            inputRef={newTaskRef}
          >
            New Task Name
          </FloatingLabelInput>
          <Select value={dueDate} onValueChange={setDueDate}>
            <option value={DueDate.NoDueDate}>No Due Date</option>
            <option value={DueDate.Monday}>Monday</option>
            <option value={DueDate.Tuesday}>Tuesday</option>
            <option value={DueDate.Wednesday}>Wednesday</option>
            <option value={DueDate.Thursday}>Thursday</option>
            <option value={DueDate.Friday}>Friday</option>
            <option value={DueDate.Saturday}>Saturday</option>
            <option value={DueDate.Sunday}>Sunday</option>
          </Select>
          <IconButton
            width="h-8"
            height="w-8"
            className="rounded-full"
            onClick={() => addTask()}
          >
            <FontAwesomeIcon icon={faPlus} />
          </IconButton>
        </div>
      </div>
      <div className="grid grid-cols-[1fr_1fr_2em] divide-y divide-x divide-gray-200/10 text-gray-300 ring-1 ring-gray-200/10 rounded-md my-2 mx-auto w-11/12">
        {tasks.length > 0 ? (
          tasks.map((task, index) => (
            <Fragment key={index}>
              <span className="inline-block px-2">{task.name}</span>
              <span className="inline-block px-2">
                {dueDateToString(task.dueDate)}
              </span>
              <button
                className="inline-block"
                onClick={() => removeTask(task.name)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </Fragment>
          ))
        ) : (
          <p className="text-center m-1 col-span-3">
            Add Some Tasks To The Group!
          </p>
        )}
      </div>
      <div className="flex flex-col items-center">
        <Button onClick={createGroup}>Submit</Button>
      </div>
    </Fragment>
  );
}

export default withAuth(CreateGroup);
