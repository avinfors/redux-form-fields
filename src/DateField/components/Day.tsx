import * as React from "react";
import { Button } from "reactstrap";
import classNames from "classnames";

interface IDayProps {
  dayFormatted: string;
  disabled: boolean;
  onClick: () => void;
  selected: boolean;
  today: boolean;
}

const Day: React.FC<IDayProps> = ({
  dayFormatted,
  disabled,
  onClick,
  selected,
  today,
}) => {
  const clickHandler = () => !disabled && onClick();

  return (
    <Button
      className={classNames(
        "border-0 outline-0 rounded",
        today && !selected && "text-secondary font-weight-bold",
        selected && !disabled && "text-white font-weight-normal"
      )}
      color={selected ? "primary" : "link"}
      disabled={disabled}
      onClick={clickHandler}
      outline={!selected}
    >
      {dayFormatted}
    </Button>
  );
};

export default Day;
