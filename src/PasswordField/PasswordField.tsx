import * as React from "react";
import { WrappedFieldProps as ReduxFormFieldProps } from "redux-form";
import {
  Input,
  InputProps as ReactstrapInputProps,
  InputGroup,
  InputGroupAddon,
  Button,
  ButtonProps,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import ErrorTooltip from "../ErrorTooltip";
import { getMetaError } from "../utils";

export type PasswordFieldProps = ReduxFormFieldProps &
  ReactstrapInputProps & {
    disabled?: React.InputHTMLAttributes<HTMLInputElement>["disabled"];
    placeholder?: React.InputHTMLAttributes<HTMLInputElement>["placeholder"];
    buttonColor?: ButtonProps["color"];
    noPast?: boolean;
  };

const PasswordField: React.FC<PasswordFieldProps> = ({
  input,
  meta,
  disabled,
  placeholder,
  noPast,
  buttonColor = "primary",
  ...rest
}) => {
  const [showPasswordState, setShowPasswordState] = React.useState(false);

  const addonClickHandler = () => setShowPasswordState(!showPasswordState);

  const pastHandler: React.ClipboardEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (noPast) {
      event.preventDefault();
    }
  };

  const metaError = getMetaError(meta);

  return (
    <ErrorTooltip data-name={input.name} error={metaError}>
      <InputGroup>
        <Input
          {...input}
          {...rest}
          disabled={disabled}
          invalid={!!metaError}
          onPaste={pastHandler}
          placeholder={placeholder}
          type={showPasswordState ? "text" : "password"}
        />
        <InputGroupAddon addonType="append">
          <Button
            disabled={disabled}
            onClick={addonClickHandler}
            outline
            color={buttonColor}
          >
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
