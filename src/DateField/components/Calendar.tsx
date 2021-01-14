import * as React from "react";

import { useDateField } from "../Provider";
import Header from "./Header";
import WeekDays from "./WeekDays";
import WeekRows from "./WeekRows";
import Months from "./Months";
import Years from "./Years";
import { format } from "../utils";

const Calendar: React.FC = () => {
  const { show, view, minDate, maxDate, defaultDate } = useDateField();

  if (!show) {
    return null;
  }

  const mouseDownHandler: React.MouseEventHandler<HTMLDivElement> = (event) =>
    event.preventDefault();

  return (
    <div
      className="p-2"
      data-defaultdate={format(defaultDate)}
      data-maxdate={format(maxDate)}
      data-mindate={format(minDate)}
      onMouseDown={mouseDownHandler}
    >
      {view === "days" && (
        <>
          <Header />
          <WeekDays />
          <WeekRows />
        </>
      )}
      {view === "months" && <Months />}
      {view === "years" && <Years />}
    </div>
  );
};

export default Calendar;
