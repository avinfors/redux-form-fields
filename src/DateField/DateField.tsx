import * as React from "react";
import { WrappedFieldProps as IReduxFormFieldProps } from "redux-form";
import { InputProps as IReactstrapInputProps, PopoverProps } from "reactstrap";

import { DateFieldProvider } from "./Provider";
import Input from "./components/Input";
import { getDefaultDate, getMinDate, getMaxDate, format } from "./utils";
import ErrorTooltip from "../ErrorTooltip";
import { getMetaError } from "../utils";

export interface IDateFieldProps extends IReduxFormFieldProps {
  calendarPosition?: PopoverProps["placement"];
  defaultDate?: Date | number;
  inputProps?: IReactstrapInputProps;
  maxDate?: Date | number;
  maxDateMessage?: (maxDate: Date | number) => string;
  minDate?: Date | number;
  minDateMessage?: (minDate: Date | number) => string;
}

const DateField: React.FC<IDateFieldProps> = ({
  input,
  meta,
  calendarPosition = "bottom",
  defaultDate = getDefaultDate(),
  inputProps = { placeholder: "дд.мм.гггг" },
  maxDate = getMaxDate(120),
  maxDateMessage = (maxDate) =>
    `Дата не может быть больше ${format(maxDate, "dd.MM.yyyy")}`,
  minDate = getMinDate(120),
  minDateMessage = (minDate) =>
    `Дата не может быть меньше ${format(minDate, "dd.MM.yyyy")}`,
}) => {
  const error = getMetaError(meta);

  return (
    <ErrorTooltip data-name={input.name} error={error}>
      <DateFieldProvider
        calendarPosition={calendarPosition}
        defaultDate={defaultDate}
        input={input}
        inputProps={{
          ...inputProps,
          "data-mindate": format(minDate, "dd.MM.yyyy"),
          "data-maxdate": format(maxDate, "dd.MM.yyyy"),
          "data-defaultdate": format(defaultDate, "dd.MM.yyyy"),
        }}
        maxDate={maxDate}
        maxDateMessage={maxDateMessage}
        meta={meta}
        minDate={minDate}
        minDateMessage={minDateMessage}
      >
        <Input />
      </DateFieldProvider>
    </ErrorTooltip>
  );
};

export default DateField;