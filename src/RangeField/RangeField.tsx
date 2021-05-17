import * as React from "react";
import { WrappedFieldProps } from "redux-form";
import { CustomInput, CustomInputProps } from "reactstrap";

import ErrorTooltip from "../ErrorTooltip";
import { getMetaError } from "../utils";

export type RangeFieldProps = WrappedFieldProps &
  Omit<CustomInputProps, "id" | "type"> & {
    disabled?: React.InputHTMLAttributes<HTMLInputElement>["disabled"];
    id?:
      | CustomInputProps["id"]
      | React.InputHTMLAttributes<HTMLInputElement>["id"];
    max: React.InputHTMLAttributes<HTMLInputElement>["max"];
    min: React.InputHTMLAttributes<HTMLInputElement>["min"];
    readOnly?: React.InputHTMLAttributes<HTMLInputElement>["readOnly"];
    step?: React.InputHTMLAttributes<HTMLInputElement>["step"];
  };

const RangeField: React.FC<RangeFieldProps> = ({
  input,
  meta,
  disabled,
  id,
  max = 100,
  min = 0,
  readOnly,
  step = 1,
  ...rest
}) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const ref = React.useRef<HTMLInputElement>(null!);

  const metaError = getMetaError(meta);

  return (
    <ErrorTooltip data-name={input.name} error={metaError}>
      <CustomInput
        {...input}
        {...rest}
        disabled={disabled}
        id={id || `${input.name}_range`}
        innerRef={ref}
        max={max}
        min={min}
        readOnly={readOnly}
        step={step}
        type="range"
      />
    </ErrorTooltip>
  );
};

export default RangeField;
