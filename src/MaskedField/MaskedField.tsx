import * as React from "react";
import { WrappedFieldProps as ReduxFormFieldProps } from "redux-form";
import {
  Input,
  InputProps as ReactstrapInputProps,
  InputGroup,
} from "reactstrap";
import MaskedInput, {
  MaskedInputProps as ReactTextMaskInputProps,
} from "react-text-mask";

import ErrorTooltip from "../ErrorTooltip";
import { getMetaError } from "../utils";

export type MaskedFieldProps = ReduxFormFieldProps &
  Omit<ReactstrapInputProps, "type"> &
  ReactTextMaskInputProps & {
    disabled?: React.InputHTMLAttributes<HTMLInputElement>["disabled"];
    inputMode?: React.InputHTMLAttributes<HTMLInputElement>["inputMode"];
    mask?: ReactTextMaskInputProps["mask"];
    pipe?: ReactTextMaskInputProps["pipe"];
    placeholder?: React.InputHTMLAttributes<HTMLInputElement>["placeholder"];
    placeholderChar?: ReactTextMaskInputProps["placeholderChar"];
  };

const MaskedField: React.FC<MaskedFieldProps> = ({
  input,
  meta,
  disabled,
  inputMode,
  mask,
  pipe,
  placeholder,
  placeholderChar = "_",
  ...rest
}) => {
  const blurHandler: React.FocusEventHandler<HTMLInputElement> = (event) => {
    const regex = new RegExp(`[${placeholderChar}]`);
    let { value } = event.target;

    if (regex.test(value)) {
      value = "";
    }
    input.onBlur(value);
  };

  const metaError = getMetaError(meta);

  return (
    <ErrorTooltip data-name={input.name} error={metaError}>
      <InputGroup>
        <MaskedInput
          {...input}
          {...rest}
          keepCharPositions
          mask={mask}
          pipe={pipe}
          placeholderChar={placeholderChar}
          render={(ref, props) => (
            <Input
              {...props}
              autoComplete="off"
              disabled={disabled}
              innerRef={ref}
              inputMode={inputMode}
              invalid={!!metaError}
              onBlur={blurHandler}
              placeholder={placeholder}
            />
          )}
        />
      </InputGroup>
    </ErrorTooltip>
  );
};

export default MaskedField;
