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
  assignedId?: string;
  assignedName?: string;
}

export interface Group {
  name: string;
  resetDay: DueDate;
  memberEmails: string[];
  members: Member[];
  tasks: Task[];
  admin: string;
  currentOffset?: number;
  currentStartDate: string;
}
