import * as React from "react";
import {
  Input,
  InputGroupAddon,
  Button,
  InputGroup,
  Popover,
} from "reactstrap";
import MaskedInput from "react-text-mask";
import createAutoCorrectedDatePipe from "text-mask-addons/dist/createAutoCorrectedDatePipe";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-regular-svg-icons";

import { useDateField } from "../Provider";
import Calendar from "./Calendar";
import { parse, isValid } from "../utils";
import { getMetaError } from "../../utils";

const InputBase: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const trigger = React.useRef<HTMLButtonElement>(null!);

  const pipe = React.useMemo(
    () => createAutoCorrectedDatePipe("dd.mm.yyyy"),
    []
  );

  const {
    input,
    meta,
    show,
    typed,
    setShow,
    setView,
    selectDay,
    setTyped,
    inputProps,
    calendarPosition,
    onCalendarOpen,
    onCalendarClose,
  } = useDateField();

  React.useEffect(() => !show && trigger.current.blur(), [show]);

  React.useEffect(() => (show ? onCalendarOpen() : onCalendarClose()), [
    show,
    onCalendarOpen,
    onCalendarClose,
  ]);

  const buttonClickHandler = () => setShow(!show);

  const blurHandler = () => input.onBlur(input.value);

  const changeHandler: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const { value } = event.target;
    const date = parse(value, "dd.MM.yyyy", 0);

    setTyped(value);
    selectDay(isValid(date) ? date : value);
  };

  const keyDownHandler = (
    inputProps: any
  ): React.KeyboardEventHandler<HTMLInputElement> => (event) => {
    const cursorPos = Number(event.currentTarget.selectionStart);
    const keyCode = Number(event.keyCode);

    if (cursorPos === 0 && keyCode === 8) {
      event.preventDefault();
      event.currentTarget.value = "";
      inputProps.onChange(event);
    }
  };

  const popoverToggleHandler = () => {
    setShow(false);
    setView("days");
  };

  const error = getMetaError(meta);

  return (
    <>
      <InputGroup>
        <MaskedInput
          {...input}
          {...inputProps}
          keepCharPositions={false}
          mask={[/\d/, /\d/, ".", /\d/, /\d/, ".", /\d/, /\d/, /\d/, /\d/]}
          onChange={changeHandler}
          pipe={pipe}
          render={(ref, props) => (
            <Input
              {...props}
              innerRef={ref}
              inputMode="numeric"
              invalid={!!error}
              onBlur={blurHandler}
              onKeyDown={keyDownHandler(props)}
            />
          )}
          value={typed ?? ""}
        />
        <InputGroupAddon addonType="append">
          <Button
            className="calendar-button"
            color={error ? "danger" : "primary"}
            innerRef={trigger}
            onClick={buttonClickHandler}
            outline
            tabIndex={-1}
          >
            <FontAwesomeIcon icon={faCalendarAlt} />
          </Button>
        </InputGroupAddon>
      </InputGroup>
      <Popover
        fade={false}
        innerClassName="shadow"
        isOpen={show}
        modifiers={{
          computeStyle: {
            gpuAcceleration: false,
          },
        }}
        placement={calendarPosition}
        target={trigger}
        toggle={popoverToggleHandler}
        trigger="focus"
      >
        <Calendar />
      </Popover>
    </>
  );
};

export default InputBase;
