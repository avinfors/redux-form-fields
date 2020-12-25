import * as React from "react";
import { WrappedFieldProps as IReduxFormFieldProps } from "redux-form";
import {
  Input,
  InputProps as IReactstrapInputProps,
  InputGroup,
} from "reactstrap";
import MaskedInput, {
  MaskedInputProps as IReactTextMaskInputProps,
} from "react-text-mask";

import ErrorTooltip from "../ErrorTooltip";
import { getMetaError } from "../utils";

export interface IMaskedFieldProps
  extends IReduxFormFieldProps,
    Omit<IReactstrapInputProps, "type">,
    IReactTextMaskInputProps {
  disabled?: React.InputHTMLAttributes<HTMLInputElement>["disabled"];
  inputMode?: React.InputHTMLAttributes<HTMLInputElement>["inputMode"];
  mask?: IReactTextMaskInputProps["mask"];
  pipe?: IReactTextMaskInputProps["pipe"];
  placeholder?: React.InputHTMLAttributes<HTMLInputElement>["placeholder"];
  placeholderChar?: IReactTextMaskInputProps["placeholderChar"];
}

const MaskedField: React.FC<IMaskedFieldProps> = ({
  input,
  meta,
  disabled,
  inputMode,
  mask,
  pipe,
  placeholder,
  placeholderChar,
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
