import * as React from "react";
import { WrappedFieldProps as ReduxFormFieldProps } from "redux-form";
import {
  CustomInput,
  CustomInputProps as ReactstrapCustomInputProps,
} from "reactstrap";

import ErrorTooltip from "../ErrorTooltip";
import { getMetaError } from "../utils";

export type CheckboxFieldProps = ReduxFormFieldProps &
  Omit<ReactstrapCustomInputProps, "id"> & {
    disabled?: React.InputHTMLAttributes<HTMLInputElement>["disabled"];
    id?:
      | ReactstrapCustomInputProps["id"]
      | React.InputHTMLAttributes<HTMLInputElement>["id"];
    label?: ReactstrapCustomInputProps["label"];
    readOnly?: React.InputHTMLAttributes<HTMLInputElement>["readOnly"];
  };

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  input,
  meta,
  disabled,
  id,
  label,
  readOnly,
  ...rest
}) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const ref = React.useRef<HTMLInputElement>(null!);

  const changeHandler: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    event.stopPropagation();
    input.onChange(event);
  };

  const metaError = getMetaError(meta);

  return (
    <ErrorTooltip data-name={input.name} error={metaError} target={ref}>
      <CustomInput
        {...input}
        {...rest}
        checked={!!input.value}
        disabled={disabled || readOnly}
        id={id || `${input.name}_custom_input`}
        innerRef={ref}
        invalid={!!metaError}
        label={label}
        onChange={changeHandler}
        type="checkbox"
      />
    </ErrorTooltip>
  );
};

export default CheckboxField;
