import DueDate, { convertDayToDate, getPreviousMonday } from "./DueDate";

it("getPreviousMonday gets a monday", () => {
  const date = getPreviousMonday();
  expect(date.getDay()).toEqual(1);
});

it("getPreviousMonday works with a start date", () => {
  const startDate = new Date(2021, 11, 29);
  const expectedDate = new Date(2021, 11, 27);
  expect(getPreviousMonday(startDate)).toEqual(expectedDate);
});

it("convertDateToDay works as expectd", () => {
  const dueDate = DueDate.Wednesday;
  const result = convertDayToDate(dueDate);
  expect(result.getDay()).toEqual(3);
});

it("convertDateToDay works handles no due date", () => {
  const dueDate = DueDate.NoDueDate;
  const result = convertDayToDate(dueDate);
  expect(result.getDay()).toEqual(0);
});
