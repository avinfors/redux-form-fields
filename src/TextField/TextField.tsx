import * as React from "react";
import {
  WrappedFieldProps as ReduxFormFieldProps,
  WrappedFieldInputProps as ReduxFormFieldInputProps,
} from "redux-form";
import {
  InputGroup,
  Input,
  InputProps as ReactstrapInputProps,
  InputGroupAddon,
} from "reactstrap";

import ErrorTooltip from "../ErrorTooltip";
import { getMetaError } from "../utils";

export type TextFieldProps = ReduxFormFieldProps &
  ReactstrapInputProps & {
    action?: {
      addon: React.ReactNode;
      callback?: (value: ReduxFormFieldInputProps["value"]) => void;
    };
    disabled?: React.InputHTMLAttributes<HTMLInputElement>["disabled"];
    noPast?: boolean;
    placeholder?: React.InputHTMLAttributes<HTMLInputElement>["placeholder"];
    readOnly?: React.InputHTMLAttributes<HTMLInputElement>["readOnly"];
    sanitazeOnBlur?: boolean;
    trimOnBlur?: boolean;
    type?: "text" | "email";
    validateLanguage?: {
      regex: RegExp;
      error: string;
    };
  };

const TextField: React.FC<TextFieldProps> = ({
  input,
  meta,
  action,
  disabled,
  noPast,
  placeholder,
  readOnly,
  sanitazeOnBlur,
  trimOnBlur,
  type,
  validateLanguage,
  ...rest
}) => {
  const [staticErrorState, setStaticErrorState] = React.useState("");

  const addonClickHandler = () => {
    if (action?.callback && !disabled) {
      action.callback(input.value);
    }
  };

  const blurHandler = () => {
    let { value }: { value: string } = input;

    if (trimOnBlur && value) {
      value = value.trim();
    }
    if (sanitazeOnBlur && value) {
      value = value.replace(/^[^A-ZА-Я]+|[^A-ZА-Я]+$/gi, "");
    }

    input.onBlur(value);
    setStaticErrorState("");
  };

  const changeHadler: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    if (validateLanguage) {
      const { regex, error } = validateLanguage;
      const { value } = event.target;

      if (value && !regex.test(value)) {
        setStaticErrorState(error);
        return;
      } else {
        setStaticErrorState("");
      }
    }
    input.onChange(event);
  };

  const pastHandler: React.ClipboardEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (noPast) {
      event.preventDefault();
    }
  };

  const metaError = getMetaError(meta);
  const error = staticErrorState && meta.active ? staticErrorState : metaError;

  return (
    <ErrorTooltip data-name={input.name} error={error}>
      <InputGroup>
        <Input
          {...input}
          {...rest}
          autoComplete="off"
          disabled={disabled}
          invalid={!!staticErrorState || !!metaError}
          onBlur={blurHandler}
          onChange={changeHadler}
          onPaste={pastHandler}
          placeholder={placeholder}
          readOnly={readOnly}
          type={type}
        />
        {action && (
          <InputGroupAddon addonType="append" onClick={addonClickHandler}>
            {action.addon}
          </InputGroupAddon>
        )}
      </InputGroup>
    </ErrorTooltip>
  );
};

export default TextField;
