import DueDate from "./DueDate";

export interface Member {
  name: string;
  id: string;
}

export interface Task {
  name: string;
  dueDate: DueDate;
  description?: string;
  completed?: boolean;
}

export interface Group {
  name: string;
  resetDay: DueDate;
  members: Member[];
  tasks: Task[];
  admin: string
}
