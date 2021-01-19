import * as React from "react";
import { WrappedFieldProps as ReduxFormFieldProps } from "redux-form";
import {
  Input,
  InputProps as ReactstrapInputProps,
  InputGroup,
} from "reactstrap";
import NumberFormat, {
  NumberFormatProps as ReactNumberFormatProps,
} from "react-number-format";

import ErrorTooltip from "../ErrorTooltip";
import { getMetaError } from "../utils";

export type NumberFieldProps = ReduxFormFieldProps &
  Omit<ReactstrapInputProps, "type"> &
  ReactNumberFormatProps & {
    allowNegative?: ReactNumberFormatProps["allowNegative"];
    decimalScale?: ReactNumberFormatProps["decimalScale"];
    decimalSeparator?: ReactNumberFormatProps["decimalSeparator"];
    disabled?: React.InputHTMLAttributes<HTMLInputElement>["disabled"];
    inputMode?: React.InputHTMLAttributes<HTMLInputElement>["inputMode"];
    fixedDecimalScale?: ReactNumberFormatProps["fixedDecimalScale"];
    maxLength: React.InputHTMLAttributes<HTMLInputElement>["maxLength"];
    placeholder?: React.InputHTMLAttributes<HTMLInputElement>["placeholder"];
    thousandSeparator?: ReactNumberFormatProps["thousandSeparator"];
    type?: "text" | "tel";
  };

const NumberField: React.FC<NumberFieldProps> = ({
  input,
  meta,
  allowNegative,
  decimalScale = 2,
  decimalSeparator = ",",
  disabled,
  inputMode,
  fixedDecimalScale = true,
  maxLength = 20,
  placeholder,
  thousandSeparator = " ",
  type,
  ...rest
}) => {
  const metaError = getMetaError(meta);

  return (
    <ErrorTooltip data-name={input.name} error={metaError}>
      <InputGroup>
        <NumberFormat
          {...input}
          {...rest}
          allowNegative={allowNegative}
          autoComplete="off"
          customInput={Input}
          decimalScale={decimalScale}
          decimalSeparator={decimalSeparator}
          disabled={disabled}
          fixedDecimalScale={fixedDecimalScale}
          inputMode={inputMode}
          invalid={!!metaError}
          maxLength={maxLength}
          placeholder={placeholder}
          thousandSeparator={thousandSeparator}
          type={type}
        />
      </InputGroup>
    </ErrorTooltip>
  );
};

export default NumberField;
