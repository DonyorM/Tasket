import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(isoWeek);
dayjs.extend(customParseFormat);
import DueDate, { convertDayToDate, getPreviousMonday } from "./DueDate";

it("getPreviousMonday gets a monday", () => {
  const date = getPreviousMonday();
  expect(date.day()).toEqual(1);
  expect(date.isBefore(dayjs())).toBeTruthy();
});

it("getPreviousMonday works with a start date", () => {
  const startDate = dayjs("2021-12-29", "YYYY-MM-DD");
  const expectedDate = dayjs("2021-12-27", "YYYY-MM-DD");
  expect(getPreviousMonday(startDate).toString()).toEqual(
    expectedDate.toString()
  );
});

it("convertDateToDay works as expected", () => {
  const dueDate = DueDate.Wednesday;
  const result = convertDayToDate(dueDate);
  expect(result.day()).toEqual(3);
});

it("convertDateToDay works as expected with startdate", () => {
  const dueDate = DueDate.Wednesday;
  const startDate = dayjs("2022-01-03", "YYYY-MM-DD");
  const result = convertDayToDate(dueDate, startDate);
  expect(result.day()).toEqual(3);
  expect(result.format("MM/DD")).toEqual("01/05");
});

it("convertDateToDay works handles no due date", () => {
  const dueDate = DueDate.NoDueDate;
  const result = convertDayToDate(dueDate);
  expect(result.day()).toEqual(0);
});
