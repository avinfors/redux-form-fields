import { isDate, startOfDay, getTime, addMinutes } from "date-fns";

const toUTC = (value) => {
  const date = new Date(value);

  return getTime(addMinutes(date, -date.getTimezoneOffset()));
};

const fromUTC = (value) => {
  const date = new Date(value);

  return getTime(addMinutes(date, date.getTimezoneOffset()));
};

export const isMs = (value) => value === parseInt(value);

export const parseDateToUTC = (value) => {
  if (!value) {
    return value;
  }
  if (isNaN(value) || !isDate(new Date(value))) {
    return value;
  }

  return toUTC(startOfDay(value));
};

export const formatDateFromUTC = (value) => {
  if (!isMs(value) || !isDate(new Date(value))) {
    return value;
  }

  return startOfDay(fromUTC(value));
};
