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

export interface IPhoneFieldProps
  extends IReduxFormFieldProps,
    Omit<IReactstrapInputProps, "type">,
    IReactTextMaskInputProps {
  disabled?: React.InputHTMLAttributes<HTMLInputElement>["disabled"];
  placeholder?: React.InputHTMLAttributes<HTMLInputElement>["placeholder"];
  placeholderChar?: IReactTextMaskInputProps["placeholderChar"];
}

const PhoneField: React.FC<IPhoneFieldProps> = ({
  input,
  meta,
  disabled,
  placeholder,
  placeholderChar = "_",
  ...rest
}) => {
  /**
   * Проверяем формат номера телефона.
   * Несмотря на маску, на некоторых iOS-устройствах при автозаполнении происходит вставка без круглых скобок и тире.
   * Поэтому в случае непрохождения проверки регуляркой и при условии, что введено 11 цифр, - преобразуем к нужному формату.
   */
  const blurHandler: React.FocusEventHandler<HTMLInputElement> = (event) => {
    let { value } = event.target;
    const isValid = /\+7\(\d{3}\)\d{3}-\d{2}-\d{2}/.test(value);
    const digits = value.replace(/\D/g, "");

    if (!isValid) {
      value =
        digits.length === 11
          ? digits.replace(
              /(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/,
              "+$1($2)$3-$4-$5"
            )
          : "";
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
          mask={[
            "+",
            "7",
            "(",
            /\d/,
            /\d/,
            /\d/,
            ")",
            /\d/,
            /\d/,
            /\d/,
            "-",
            /\d/,
            /\d/,
            "-",
            /\d/,
            /\d/,
          ]}
          placeholderChar={placeholderChar}
          render={(ref, props) => (
            <Input
              {...props}
              autoComplete="off"
              disabled={disabled}
              innerRef={ref}
              inputMode="numeric"
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

export default PhoneField;
