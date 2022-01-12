import DueDate from "./DueDate";

export interface Member {
  name: string | null | undefined;
  id: string;
  unsubscribed?: boolean;
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
  members: Member[];
  memberEmails: string[];
  tasks: Task[];
  admin: string;
  currentOffset?: number;
  currentStartDate: string;
}
