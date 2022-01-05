import * as dayjs from "dayjs";

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

export const convertDayToDate = (dueDate: DueDate, startDate: dayjs.Dayjs) => {
  return moveToNextDay(
    startDate,
    DueDate.NoDueDate === dueDate ? DueDate.Sunday : dueDate
  );
};

// Pulled from here: https://stackoverflow.com/a/11789820/2719960
export const moveToNextDay = (startDate: dayjs.Dayjs, targetDay: DueDate) => {
  const currentDay = startDate.day();
  const distance = (targetDay + 7 - currentDay) % 7;
  return startDate.add(distance, "day");
};

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
