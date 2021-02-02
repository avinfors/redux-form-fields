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
  getDefaultDate,
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

  const prevDirty = React.useRef(meta.dirty);
  const errorTypedState = React.useRef(null);

  const inputTime = React.useMemo(
    () => (input.value instanceof Date ? input.value.getTime() : undefined),
    [input.value]
  );

  const minDateTime = React.useMemo(
    () =>
      minDate instanceof Date && isValid(minDate)
        ? minDate.getTime()
        : getDefaultDate().getTime(),
    [minDate]
  );

  const maxDateTime = React.useMemo(
    () =>
      maxDate instanceof Date && isValid(maxDate)
        ? maxDate.getTime()
        : getDefaultDate().getTime(),
    [maxDate]
  );

  const defaultDateTime = React.useMemo(
    () =>
      defaultDate instanceof Date && isValid(defaultDate)
        ? defaultDate.getTime()
        : minDateTime,
    [defaultDate, minDateTime]
  );

  const [viewState, setViewState] = React.useState<ViewType>("days");
  const [dateState, setDateState] = React.useState(() =>
    getInitialDate(inputTime)
  );
  const [monthState, setMonthState] = React.useState(() =>
    getInitialMonth(inputTime, defaultDateTime)
  );
  const [showState, setShowState] = React.useState(false);
  const [typedState, setTypedState] = React.useState("");

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
        if (!isBefore(value, minDateTime) && !isAfter(value, maxDateTime)) {
          setDateState(value);
          setMonthState(value);
        }
        input.onChange(value);
        if (selected) {
          input.onBlur(value);
        }
      } else {
        setDateState(getInitialDate(undefined));
        setMonthState(getInitialMonth(undefined, defaultDateTime));
        input.onChange(undefined);
      }

      setShowState(false);
    },
    [input, defaultDateTime, maxDateTime, minDateTime]
  );

  React.useEffect(() => {
    if (inputTime !== undefined) {
      setTypedState((prev) => (prev !== "" ? prev : format(inputTime)));
    }
  }, [inputTime]);

  React.useEffect(() => {
    const { value, onChange, onBlur } = input;

    if (value instanceof Date) {
      let error = "";

      if (isBefore(value, minDateTime)) {
        error = minDateMessage(minDateTime);
      } else if (isAfter(value, maxDateTime)) {
        error = maxDateMessage(maxDateTime);
      }

      if (error !== "") {
        onChange(error);
        if (!meta.active) {
          onBlur(error);
        }

        setDateState(getInitialDate(undefined));
        setMonthState(getInitialMonth(undefined, defaultDateTime));
        errorTypedState.current = typedState;
      }
    } else {
      if (errorTypedState.current === typedState) {
        const parsedDate = parse(typedState, "dd.MM.yyyy", 0);
        if (isValid(parsedDate)) {
          if (
            !isBefore(parsedDate, minDateTime) &&
            !isAfter(parsedDate, maxDateTime)
          ) {
            setDateState(parsedDate);
            setMonthState(parsedDate);
            input.onChange(parsedDate);
            input.onBlur(parsedDate);
            errorTypedState.current = null;
          }
        }
      }
    }
  }, [
    input,
    meta.active,
    minDateTime,
    maxDateTime,
    minDateMessage,
    maxDateMessage,
    defaultDateTime,
    typedState,
  ]);

  React.useEffect(() => {
    const dirty = meta.dirty;
    const initial = meta.initial;
    const visited = meta.visited;

    if (prevDirty && !dirty && !visited) {
      let typed = "";

      if (initial instanceof Date || typeof initial === "number") {
        typed = format(initial);

        if (!isBefore(initial, minDateTime) && !isAfter(initial, maxDateTime)) {
          const value = initial instanceof Date ? initial : new Date(initial);

          setDateState(value);
          setMonthState(value);
        }
      } else {
        setDateState(getInitialDate(undefined));
        setMonthState(getInitialMonth(undefined, defaultDateTime));
      }
      setTypedState(typed);
    }

    return () => (prevDirty.current = dirty);
  }, [
    meta.dirty,
    meta.initial,
    meta.visited,
    defaultDateTime,
    minDateTime,
    maxDateTime,
  ]);

  React.useEffect(() => {
    showState && setMonthState(getInitialMonth(inputTime, defaultDateTime));
  }, [showState, inputTime, defaultDateTime]);

  return (
    <DateFieldCtx.Provider
      value={{
        ...props,
        inputProps: {
          ...props.inputProps,
          "data-mindate": format(minDateTime, "dd.MM.yyyy"),
          "data-maxdate": format(maxDateTime, "dd.MM.yyyy"),
          "data-defaultdate": format(defaultDateTime, "dd.MM.yyyy"),
        },
        minDate: minDateTime,
        maxDate: maxDateTime,
        defaultDate: defaultDateTime,
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
