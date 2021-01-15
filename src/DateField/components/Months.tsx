import * as React from "react";
import { ButtonGroup, Button } from "reactstrap";
import classNames from "classnames";

import { useDateField } from "../Provider";
import {
  subYears,
  addYears,
  getYear,
  startOfMonth,
  setMonths,
  getMonths,
  startOfYear,
  endOfYear,
  eachMonthOfInterval,
  isBefore,
  isAfter,
  isEqual,
  format,
} from "../utils";

const Months: React.FC = () => {
  const { month, minDate, maxDate, setMonth, setView } = useDateField();

  const prevClickHandler = () => setMonth(subYears(month, 1));

  const nextClickHandler = () => setMonth(addYears(month, 1));

  const yearClickHandler = () => setView("years");

  const monthClickHandler = (day: Date, disabled: boolean) => () => {
    if (disabled) {
      return;
    }

    const months = getMonths(day);

    setMonth(setMonths(day, months));
    setView("days");
  };

  const isMonthDisabled = (month: Date) => {
    const minDateMonth = startOfMonth(minDate);
    const maxDateMonth = startOfMonth(maxDate);

    return month < minDateMonth || month > maxDateMonth;
  };

  const isMonthSelected = (day: Date) => isEqual(day, startOfMonth(month));

  const isPrevDisabled = () => {
    const prevYear = subYears(month, 1);
    const end = endOfYear(prevYear);

    return isBefore(end, minDate);
  };

  const isNextDisabled = () => {
    const nextYear = addYears(month, 1);
    const start = startOfYear(nextYear);

    return isAfter(start, maxDate);
  };

  const prevDisabled = isPrevDisabled();
  const nextDisabled = isNextDisabled();

  const months = eachMonthOfInterval({
    start: startOfYear(month),
    end: endOfYear(month),
  });

  const rows = months.reduce<Date[][]>((acc, m) => {
    const lastRow = acc[acc.length - 1] ?? [];

    if (lastRow.length > 0 && lastRow.length < 4) {
      acc[acc.length - 1].push(m);
    } else {
      acc.push([m]);
    }
    return acc;
  }, []);

  const year = getYear(month);

  return (
    <>
      <div className="d-flex justify-content-between bg-white border-bottom">
        <Button
          className={classNames(
            "rounded-0 border-0 outline-0",
            prevDisabled && "invisible"
          )}
          color="link"
          disabled={prevDisabled}
          onClick={prevClickHandler}
          outline
        >
          {"<"}
        </Button>
        <Button
          className="rounded-0 border-0 outline-0"
          color="link"
          onClick={yearClickHandler}
          outline
        >
          <span> {year}</span>
        </Button>
        <Button
          className={classNames(
            "rounded-0 border-0 outline-0",
            nextDisabled && "invisible"
          )}
          color="link"
          disabled={nextDisabled}
          onClick={nextClickHandler}
          outline
        >
          {">"}
        </Button>
      </div>
      <div className="mb-2">
        {rows.map((row, index) => (
          <ButtonGroup key={index} className="w-100" size="sm">
            {row.map((day) => {
              const monthName = format(day, "LLL");
              const disabled = isMonthDisabled(day);
              const selected = isMonthSelected(day);

              return (
                <Button
                  key={day.getTime()}
                  className={classNames(
                    "w-100 border-0 outline-0 rounded",
                    selected && !disabled && "text-white font-weight-normal"
                  )}
                  color={selected ? "primary" : "link"}
                  disabled={disabled}
                  onClick={monthClickHandler(day, disabled)}
                  outline={!selected}
                >
                  {monthName.substr(0, 3)}
                </Button>
              );
            })}
          </ButtonGroup>
        ))}
      </div>
    </>
  );
};

export default Months;
