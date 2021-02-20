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
  isEqual,
} from "./utils";

type ViewType = "days" | "months" | "years";

type DateFieldProviderProps = DateFieldProps & {
  onCalendarClose: () => void;
  onCalendarOpen: () => void;
};

type DateFieldProviderState = {
  view: ViewType;
  date: Date;
  month: Date;
  show: boolean;
  typed: string;
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
export class DateFieldProvider extends React.Component<
  DateFieldProviderProps,
  DateFieldProviderState
> {
  state: DateFieldProviderState = {
    view: "days",
    date: getInitialDate(this.props.input.value),
    month: getInitialMonth(this.props.input.value, this.props.defaultDate),
    show: false,
    typed: "",
  };

  componentDidMount(): void {
    const { input, meta } = this.props;
    const { typed } = this.state;
    const day = input.value;
    const selectedDate = day instanceof Date;

    if (selectedDate) {
      this.setTypedState(format(day));
      this.validate(day);
    } else if (!typed) {
      input.onChange(meta.initial ? "" : undefined);
    }
  }

  componentDidUpdate(
    prevProps: DateFieldProviderProps,
    prevState: DateFieldProviderState
  ): void {
    const { show: _show } = prevState;
    const { show } = this.state;
    const { input: _input, minDate: _minDate, maxDate: _maxDate } = prevProps;
    const { input, defaultDate, minDate, maxDate } = this.props;

    if (!_show && show) {
      this.setMonthState(getInitialMonth(input.value, defaultDate));
    }

    if (!isEqual(_minDate, minDate) || !isEqual(_maxDate, maxDate)) {
      this.validate(input.value);
    }

    let valuesIsEqual = true;
    const prevValue = _input.value;
    const thisValue = input.value;
    const prevValueIsDate = prevValue instanceof Date;
    const thisValueIsDate = thisValue instanceof Date;

    if (prevValueIsDate && thisValueIsDate && !isEqual(prevValue, thisValue)) {
      valuesIsEqual = false;
    }

    if (!prevValueIsDate && !thisValueIsDate && prevValue !== thisValue) {
      valuesIsEqual = false;
    }

    if (prevValueIsDate !== thisValueIsDate) {
      valuesIsEqual = false;
    }

    if (!valuesIsEqual) {
      if (thisValueIsDate) {
        this.setTypedState(format(thisValue));
        const isValid = this.validate(thisValue);
        if (isValid) {
          this.setMonthState(thisValue);
          this.setDateState(thisValue);
        } else {
          this.setDateState(getInitialDate(undefined));
          this.setMonthState(getInitialMonth(undefined, defaultDate));
        }
      } else {
        this.setDateState(getInitialDate(undefined));
        this.setMonthState(getInitialMonth(undefined, defaultDate));
      }
    }
  }

  validate = (selected: Date): boolean => {
    const {
      minDate,
      maxDate,
      minDateMessage,
      maxDateMessage,
      input,
      meta,
    } = this.props;

    if (selected instanceof Date) {
      let error = "";

      if (isBefore(selected, minDate)) {
        error = minDateMessage(minDate);
      } else if (isAfter(selected, maxDate)) {
        error = maxDateMessage(maxDate);
      }

      if (error !== "") {
        input.onChange(error);

        if (!meta.active) {
          input.onBlur(error);
        }
        return false;
      }
    }

    return true;
  };

  setViewState = (view: ViewType): void => {
    this.setState({ view });
  };

  setDateState = (date: Date): void => {
    this.setState({ date });
  };

  setMonthState = (month: Date): void => {
    this.setState({ month });
  };

  setShowState = (show: boolean): void => {
    this.setState({ show });
  };

  setTypedState = (typed: string): void => {
    this.setState({ typed });
  };

  selectDay = (day: string | Date): void => {
    const { input, meta } = this.props;
    let value = day;
    const selected = day instanceof Date;

    this.setTypedState(selected ? format(day as Date) : (day as string));

    if (!selected) {
      const parsedDate = parse(day as string, "dd.MM.yyyy", 0);

      if (isValid(parsedDate)) {
        value = parsedDate;
      }
    }

    if (value instanceof Date) {
      input.onChange(value);

      if (selected) {
        input.onBlur(value);
      }
    } else {
      input.onChange(meta.initial !== undefined ? "" : undefined);
    }

    this.setShowState(false);
  };

  render(): JSX.Element {
    const { children, ...props } = this.props;
    const { view, date, month, show, typed } = this.state;
    const { defaultDate, disabled, minDate, maxDate, prepend } = props;
    return (
      <DateFieldCtx.Provider
        value={{
          ...props,
          inputProps: {
            ...props.inputProps,
            "data-mindate": format(minDate, "dd.MM.yyyy"),
            "data-maxdate": format(maxDate, "dd.MM.yyyy"),
            "data-defaultdate": format(defaultDate, "dd.MM.yyyy"),
          },
          minDate,
          maxDate,
          defaultDate,
          disabled,
          prepend,
          view,
          date,
          month,
          show,
          typed,
          setView: this.setViewState,
          setDate: this.setDateState,
          setMonth: this.setMonthState,
          setShow: this.setShowState,
          setTyped: this.setTypedState,
          selectDay: this.selectDay,
        }}
      >
        {children}
      </DateFieldCtx.Provider>
    );
  }
}
