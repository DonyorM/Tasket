import dayjs from "dayjs";

enum DueDate {
  NoDueDate = -1,
  Sunday,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
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

export const allDates = [
  DueDate.NoDueDate,
  DueDate.Sunday,
  DueDate.Monday,
  DueDate.Tuesday,
  DueDate.Wednesday,
  DueDate.Thursday,
  DueDate.Friday,
  DueDate.Saturday,
];

export const getPreviousMonday = (date: dayjs.Dayjs | null = null) => {
  const inDate = date || dayjs();
  return inDate.startOf("isoWeek");
};

export const convertDayToDate = (dueDate: DueDate, startDate?: dayjs.Dayjs) => {
  const startingDate = startDate || getPreviousMonday();
  return moveToNextDay(
    startingDate,
    DueDate.NoDueDate === dueDate ? DueDate.Sunday : dueDate
  );
};

// Pulled from here: https://stackoverflow.com/a/11789820/2719960
export const moveToNextDay = (startDate: dayjs.Dayjs, targetDay: DueDate) => {
  const currentDay = startDate.day();
  const distance = (targetDay + 7 - currentDay) % 7;
  return startDate.add(distance, "day");
};

export default DueDate;
