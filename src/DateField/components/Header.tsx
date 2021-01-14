import * as React from "react";
import { Button } from "reactstrap";
import classNames from "classnames";

import { useDateField } from "../Provider";
import {
  format,
  getYear,
  subMonths,
  addMonths,
  startOfMonth,
  endOfMonth,
  isBefore,
  isAfter,
} from "../utils";

const Header = () => {
  const { month, setMonth, setView, minDate, maxDate } = useDateField();
  const mounthName = format(month, "LLLL");
  const year = getYear(month);

  const prevClickHandler = () => setMonth(subMonths(month, 1));

  const nextClickHandler = () => setMonth(addMonths(month, 1));

  const monthYearClickHandler = () => setView("months");

  const isPrevDisabled = () => {
    const prev = subMonths(month, 1);
    const end = endOfMonth(prev);

    return isBefore(end, minDate);
  };

  const isNextDisabled = () => {
    const next = addMonths(month, 1);
    const start = startOfMonth(next);

    return isAfter(start, maxDate);
  };

  const prevDisabled = isPrevDisabled();
  const nextDisabled = isNextDisabled();

  return (
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
        onClick={monthYearClickHandler}
        outline
      >
        <span className="text-capitalize">{mounthName}</span>
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
  );
};

export default Header;
