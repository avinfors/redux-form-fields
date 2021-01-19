import * as React from "react";
import { WrappedFieldProps as ReduxFormFieldProps } from "redux-form";
import {
  Input,
  InputProps as ReactstrapInputProps,
  InputGroup,
  InputGroupAddon,
  Button,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import ErrorTooltip from "../ErrorTooltip";
import { getMetaError } from "../utils";

export type PasswordFieldProps = ReduxFormFieldProps &
  ReactstrapInputProps & {
    disabled?: React.InputHTMLAttributes<HTMLInputElement>["disabled"];
    placeholder?: React.InputHTMLAttributes<HTMLInputElement>["placeholder"];
  };

const PasswordField: React.FC<PasswordFieldProps> = ({
  input,
  meta,
  disabled,
  placeholder,
  ...rest
}) => {
  const [showPasswordState, setShowPasswordState] = React.useState(false);

  const addonClickHandler = () => setShowPasswordState(!showPasswordState);

  const metaError = getMetaError(meta);

  return (
    <ErrorTooltip data-name={input.name} error={metaError}>
      <InputGroup>
        <Input
          {...input}
          {...rest}
          disabled={disabled}
          invalid={!!metaError}
          placeholder={placeholder}
          type={showPasswordState ? "text" : "password"}
        />
        <InputGroupAddon addonType="append">
          <Button disabled={disabled} onClick={addonClickHandler} outline>
            <FontAwesomeIcon
              fixedWidth
              icon={showPasswordState ? faEye : faEyeSlash}
            />
          </Button>
        </InputGroupAddon>
      </InputGroup>
    </ErrorTooltip>
  );
};

export default PasswordField;
