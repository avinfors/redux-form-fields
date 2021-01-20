import * as React from "react";

import { DateFieldProps } from "./DateField";
import {
  getInitialMonth,
  getInitialDate,
  format,
  isValid,
  isBefore,
  isAfter,
} from "./utils";

type ViewType = "days" | "months" | "years";

type DateFieldProviderProps = DateFieldProps & {
  onCalendarClose: () => void;
  onCalendarOpen: () => void;
};

type DateFieldCtxProps = DateFieldProviderProps & {
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
  selectDay: (day: any) => void;
};

const DateFieldCtx = React.createContext<DateFieldCtxProps>(null);

export const useDateField = (): DateFieldCtxProps =>
  React.useContext(DateFieldCtx);

export const DateFieldProvider: React.FC<
  React.PropsWithChildren<DateFieldProviderProps>
> = ({ children, ...props }) => {
  const {
    input,
    defaultDate,
    minDate,
    minDateMessage,
    maxDate,
    maxDateMessage,
  } = props;

  const ref = React.useRef(false);

  const [viewState, setViewState] = React.useState<ViewType>("days");
  const [dateState, setDateState] = React.useState(() =>
    getInitialDate(input.value)
  );
  const [monthState, setMonthState] = React.useState(() =>
    getInitialMonth(input.value, defaultDate)
  );
  const [showState, setShowState] = React.useState(false);
  const [typedState, setTypedState] = React.useState("");

  const selectDay = React.useCallback(
    (day) => {
      if (typeof day !== "string" && isValid(day)) {
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
    },
    [input, minDate, minDateMessage, maxDate, maxDateMessage, showState]
  );

  React.useEffect(() => {
    if (!ref.current) {
      selectDay(input.value);
      ref.current = true;
    }
  }, [selectDay, input.value]);

  React.useEffect(() => {
    const value = input.value;

    if (typeof value !== "string" && isValid(value)) {
      setDateState(value);
      setMonthState(value);
      setTypedState(format(value));
    } else {
      setDateState(getInitialDate(value));
      setMonthState(getInitialMonth(value, defaultDate));
    }
  }, [input.value, defaultDate]);

  React.useEffect(() => {
    if (showState && !dateState) {
      setMonthState(getInitialMonth(input.value, defaultDate));
    }
  }, [showState, dateState, input.value, defaultDate]);

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
