import moment, { unitOfTime } from "moment";

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

export const dueDateToString = (date: DueDate) => {
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
  }
};

export const convertDayToDate = (
  dueDate: DueDate,
  startDate?: moment.Moment
) => {
  const startingDate = startDate ?? moment().isoWeekday(1);
  return startingDate
    .clone()
    .weekday(dueDate === DueDate.NoDueDate ? DueDate.Sunday : dueDate);
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
