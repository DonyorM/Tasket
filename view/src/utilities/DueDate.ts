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

export const convertDayToDate = (dueDate: DueDate, startDate?: Date) => {
  const startingDate = startDate || getPreviousMonday();
  return moveToNextDay(
    startingDate,
    DueDate.NoDueDate === dueDate ? DueDate.Sunday : dueDate
  );
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

export const getPreviousMonday = (date: Date | null = null) => {
  const prevMonday = (date && new Date(date.valueOf())) || new Date();
  prevMonday.setDate(prevMonday.getDate() - ((prevMonday.getDay() + 6) % 7));
  return prevMonday;
};

// Pulled from here: https://stackoverflow.com/a/11789820/2719960
export const moveToNextDay = (startDate: Date, targetDay: DueDate) => {
  const date = new Date(startDate.getTime());
  let currentDay = startDate.getDay();
  let distance = (targetDay + 7 - currentDay) % 7;
  date.setDate(date.getDate() + distance);
  return date;
};

export default DueDate;
