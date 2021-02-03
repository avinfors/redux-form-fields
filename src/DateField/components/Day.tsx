import * as React from "react";
import { Button } from "reactstrap";
import classNames from "classnames";

interface IDayProps {
  dayFormatted: string;
  disabled: boolean;
  onClick: () => void;
  selected: boolean;
}

const Day: React.FC<IDayProps> = ({
  dayFormatted,
  disabled,
  onClick,
  selected,
}) => {
  const clickHandler = () => !disabled && onClick();

  return (
    <Button
      className={classNames(
        "border-0 outline-0 rounded",
        selected && !disabled && "text-white font-weight-normal",
        disabled && "text-black-50"
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
