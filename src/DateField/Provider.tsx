import * as React from "react";

import { DateFieldProps } from "./DateField";
import {
  getInitialMonth,
  getInitialDate,
  parse,
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
    meta,
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

  const prevDirty = React.useRef(meta.dirty);

  const selectDay = React.useCallback(
    (day) => {
      let value = day;
      const selected = day instanceof Date;
      setTypedState(selected ? format(day) : day);

      if (!selected) {
        const parsedDate = parse(day, "dd.MM.yyyy", 0);

        if (isValid(parsedDate)) {
          value = parsedDate;
        }
      }

      if (value instanceof Date) {
        if (!isBefore(value, minDate) && !isAfter(value, maxDate)) {
          setDateState(value);
          setMonthState(value);
        }
        input.onChange(value);
        if (selected) {
          input.onBlur(value);
        }
      } else {
        setDateState(getInitialDate(undefined));
        setMonthState(getInitialMonth(undefined, defaultDate));
        input.onChange(undefined);
      }

      setShowState(false);
    },
    [input, defaultDate, maxDate, minDate]
  );

  React.useEffect(() => {
    const value = input.value;

    if (value instanceof Date) {
      setTypedState((prev) => (prev !== "" ? prev : format(value)));
    }
  }, [input.value]);

  React.useEffect(() => {
    const { value, onChange, onBlur } = input;

    if (value instanceof Date) {
      let error = "";

      if (isBefore(value, minDate)) {
        error = minDateMessage(minDate);
      } else if (isAfter(value, maxDate)) {
        error = maxDateMessage(maxDate);
      }

      if (error !== "") {
        onChange(error);
        if (!meta.active) {
          onBlur(error);
        }

        setDateState(getInitialDate(undefined));
        setMonthState(getInitialMonth(undefined, defaultDate));
      }
    }
  }, [
    input,
    meta.active,
    minDate,
    maxDate,
    minDateMessage,
    maxDateMessage,
    defaultDate,
  ]);

  React.useEffect(() => {
    const dirty = meta.dirty;
    const initial = meta.initial;
    const visited = meta.visited;

    if (prevDirty && !dirty && !visited) {
      let typed = "";

      if (initial instanceof Date || typeof initial === "number") {
        typed = format(initial);

        if (!isBefore(initial, minDate) && !isAfter(initial, maxDate)) {
          const value = initial instanceof Date ? initial : new Date(initial);

          setDateState(value);
          setMonthState(value);
        }
      } else {
        setDateState(getInitialDate(undefined));
        setMonthState(getInitialMonth(undefined, defaultDate));
      }
      setTypedState(typed);
    }

    return () => (prevDirty.current = dirty);
  }, [meta.dirty, meta.initial, meta.visited, defaultDate, minDate, maxDate]);

  React.useEffect(() => {
    showState && setMonthState(getInitialMonth(input.value, defaultDate));
  }, [showState, input.value, defaultDate]);

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
