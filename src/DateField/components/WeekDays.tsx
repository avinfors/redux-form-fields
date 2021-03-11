import * as React from "react";
import { ButtonGroup, Button } from "reactstrap";

import { useDateField } from "../Provider";
import { startOfWeek, endOfWeek, eachDayOfInterval, format } from "../utils";

const WeekDays: React.FC = () => {
  const { month, locale } = useDateField();

  const start = startOfWeek(month, { weekStartsOn: 1 });
  const end = endOfWeek(month, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start, end });

  return (
    <ButtonGroup className="w-100" size="sm">
      {days.map((day) => (
        <Button key={day.getDate()} color="link" disabled>
          {format(day, "EEEEEE", locale)}
        </Button>
      ))}
    </ButtonGroup>
  );
};

export default WeekDays;
