import * as React from "react";

import { IDateFieldProps } from "./DateField";
import {
  getInitialMonth,
  getInitialDate,
  format,
  isValid,
  isBefore,
  isAfter,
} from "./utils";

type SelectDayType = (day: any) => void;
type ViewType = "days" | "months" | "years";

interface IDateFieldCtxProps extends IDateFieldProps {
  view: ViewType;
  date: Date;
  month: Date;
  show: boolean;
  typed: string;
  setView: (view: ViewType) => void;
  setDate: (date: Date) => void;
  setMonth: (month: Date) => void;
  setShow: (show: boolean) => void;
  setTyped: (typed: string) => void;
  selectDay: SelectDayType;
}

const DateFieldCtx = React.createContext<IDateFieldCtxProps>(null);

export const useDateField = () => React.useContext(DateFieldCtx);

interface IDateFieldProviderProps extends IDateFieldProps {}

export const DateFieldProvider: React.FC<
  React.PropsWithChildren<IDateFieldProviderProps>
> = ({ children, ...props }) => {
  const {
    input,
    defaultDate,
    minDate,
    minDateMessage,
    maxDate,
    maxDateMessage,
  } = props;

  const [viewState, setViewState] = React.useState<ViewType>("days");
  const [dateState, setDateState] = React.useState(() =>
    getInitialDate(input.value)
  );
  const [monthState, setMonthState] = React.useState(() =>
    getInitialMonth(input.value, defaultDate)
  );
  const [showState, setShowState] = React.useState(false);
  const [typedState, setTypedState] = React.useState("");

  const selectDay: SelectDayType = (day) => {
    if (isValid(day)) {
      if (isBefore(day, minDate)) {
        input.onChange(minDateMessage(minDate));
      } else if (isAfter(day, maxDate)) {
        input.onChange(maxDateMessage(maxDate));
      } else {
        input.onChange(day);
      }
    } else {
      input.onChange("");
    }
    if (showState) {
      setShowState(false);
    }
  };

  React.useEffect(() => {
    if (isValid(input.value)) {
      setDateState(input.value);
      setMonthState(input.value);
      setTypedState(format(input.value));
    } else {
      setDateState(getInitialDate(input.value));
      setMonthState(getInitialMonth(input.value, defaultDate));
    }
  }, [
    input.value,
    format,
    isValid,
    getInitialMonth,
    getInitialDate,
    defaultDate,
  ]);

  React.useEffect(() => {
    if (showState && !dateState) {
      setMonthState(getInitialMonth(input.value, defaultDate));
    }
  }, [showState, dateState, input.value, defaultDate, getInitialMonth]);

  return (
    <DateFieldCtx.Provider
      value={{
        ...props,
        view: viewState,
        date: dateState,
        month: monthState,
        show: showState,
        typed: typedState,
        setView: setViewState,
        setDate: setDateState,
        setMonth: setMonthState,
        setShow: setShowState,
        setTyped: setTypedState,
        selectDay,
      }}
    >
      {children}
    </DateFieldCtx.Provider>
  );
};
