enum DueDate {
  NoDueDate,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sunday,
}

export const dueDateToString = (date: DueDate): string => {
  switch (+date) {
    case DueDate.NoDueDate:
      return "No Due Date";
    case DueDate.Monday:
      return "Monday";
    case DueDate.Tuesday:
      return "Tuesday";
    case DueDate.Wednesday:
      return "Wednesday";
    case DueDate.Thursday:
      return "Thursday";
    case DueDate.Friday:
      return "Friday";
    case DueDate.Saturday:
      return "Saturday";
    case DueDate.Sunday:
      return "Sunday";
    default:
      return "Invalid Enum"; // Should never happen
  }
};

export const allDates = [
  DueDate.NoDueDate,
  DueDate.Monday,
  DueDate.Tuesday,
  DueDate.Wednesday,
  DueDate.Thursday,
  DueDate.Friday,
  DueDate.Saturday,
  DueDate.Sunday,
];

export default DueDate;
