import React, { useState } from "react";
import { ButtonGroup, Button } from "reactstrap";
import classNames from "classnames";

import { useDateField } from "../Provider";
import { getYear, setYear } from "../utils";

const Years: React.FC = () => {
  const { month, minDate, maxDate, setMonth, setView } = useDateField();

  const [lastYear, setLastYear] = useState(getYear(month));

  const yearsToShow = 16;
  const yearsPerRow = 4;
  const firstYear = lastYear - yearsToShow + 1;
  const interval = lastYear - firstYear + 1;

  const years = Array(interval)
    .fill("")
    .map((_, i) => firstYear + i);

  const rows = years.reduce<number[][]>((acc, m) => {
    const lastRow = acc[acc.length - 1] ?? [];
    if (lastRow.length > 0 && lastRow.length < yearsPerRow) {
      acc[acc.length - 1].push(m);
    } else {
      acc.push([m]);
    }
    return acc;
  }, []);

  const prevClickHandler = () => setLastYear(firstYear - 1);

  const nextClickHandler = () => setLastYear(lastYear + yearsToShow);

  const yearClickHandler = (year: number, disabled: boolean) => () => {
    if (disabled) {
      return;
    }
    setMonth(setYear(month, year));
    setView("months");
  };

  const isYearDisabled = (year: number) =>
    year < getYear(minDate) || year > getYear(maxDate);

  const isYearSelected = (year: number) => year === getYear(month);

  const isPrevDisabled = () => {
    const prevLastYear = firstYear - 1;
    const minYear = getYear(minDate);

    return prevLastYear < minYear;
  };

  const isNextDisabled = () => {
    const nextFirstYear = lastYear + 1;
    const maxYear = getYear(maxDate);

    return nextFirstYear > maxYear;
  };

  const prevDisabled = isPrevDisabled();
  const nextDisabled = isNextDisabled();

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
        <Button className="rounded-0 border-0 outline-0" color="link" outline>
          <span>
            {" "}
            {firstYear} – {lastYear}
          </span>
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
            {row.map((year) => {
              const disabled = isYearDisabled(year);
              const selected = isYearSelected(year);

              return (
                <Button
                  key={year}
                  className={classNames(
                    "w-100 border-0 outline-0 rounded",
                    selected && !disabled && "text-white font-weight-normal"
                  )}
                  color={selected ? "primary" : "link"}
                  disabled={disabled}
                  onClick={yearClickHandler(year, disabled)}
                  outline={!selected}
                >
                  {year}
                </Button>
              );
            })}
          </ButtonGroup>
        ))}
      </div>
    </>
  );
};

export default Years;
