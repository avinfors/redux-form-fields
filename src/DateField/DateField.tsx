import * as React from "react";
import { WrappedFieldProps as ReduxFormFieldProps } from "redux-form";
import { InputProps as ReactstrapInputProps, PopoverProps } from "reactstrap";

import { DateFieldProvider } from "./Provider";
import Input from "./components/Input";
import { getDefaultDate, getMinDate, getMaxDate, format } from "./utils";
import ErrorTooltip from "../ErrorTooltip";
import { getMetaError } from "../utils";

export type DateFieldProps = ReduxFormFieldProps & {
  calendarPosition?: PopoverProps["placement"];
  defaultDate?: Date | number;
  disabled?: boolean;
  inputProps?: ReactstrapInputProps;
  locale?: string;
  maxDate?: Date | number;
  maxDateMessage?: (maxDate: Date | number) => string;
  minDate?: Date | number;
  minDateMessage?: (minDate: Date | number) => string;
  prepend?: React.ReactNode;
};

const DateField: React.FC<DateFieldProps> = ({
  input,
  meta,
  calendarPosition = "bottom",
  defaultDate = getDefaultDate(),
  disabled,
  prepend,
  inputProps = { placeholder: "дд.мм.гггг" },
  locale,
  maxDate = getMaxDate(120),
  maxDateMessage = (maxDate) =>
    `Дата не может быть больше ${format(maxDate, "dd.MM.yyyy")}`,
  minDate = getMinDate(120),
  minDateMessage = (minDate) =>
    `Дата не может быть меньше ${format(minDate, "dd.MM.yyyy")}`,
}) => {
  const [tooltipHiddenState, setTooltipHiddenState] = React.useState(false);

  const error = getMetaError(meta);

  return (
    <ErrorTooltip
      alwaysHidden={tooltipHiddenState}
      data-name={input.name}
      error={error}
    >
      <DateFieldProvider
        calendarPosition={calendarPosition}
        defaultDate={defaultDate}
        disabled={disabled}
        prepend={prepend}
        input={input}
        inputProps={{
          ...inputProps,
          "data-mindate": format(minDate, "dd.MM.yyyy"),
          "data-maxdate": format(maxDate, "dd.MM.yyyy"),
          "data-defaultdate": format(defaultDate, "dd.MM.yyyy"),
        }}
        locale={locale}
        maxDate={maxDate}
        maxDateMessage={maxDateMessage}
        meta={meta}
        minDate={minDate}
        minDateMessage={minDateMessage}
        onCalendarClose={() => setTooltipHiddenState(false)}
        onCalendarOpen={() => setTooltipHiddenState(true)}
      >
        <Input />
      </DateFieldProvider>
    </ErrorTooltip>
  );
};

export default DateField;
