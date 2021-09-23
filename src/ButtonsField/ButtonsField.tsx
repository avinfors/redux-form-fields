import * as React from "react";
import { WrappedFieldProps as ReduxFormFieldProps } from "redux-form";
import { ButtonGroup, Row, Col } from "reactstrap";
import classNames from "classnames";

import ErrorTooltip from "../ErrorTooltip";
import Item from "./components/Item";
import { getMetaError } from "../utils";

export type ButtonsFieldOption = {
  [key: string]: string | number | boolean;
};

export type ButtonsFieldProps = ReduxFormFieldProps & {
  block?: boolean;
  buttonsPerRow: number;
  codeName?: string;
  disabled?: boolean;
  equalWidth?: boolean;
  options?: ButtonsFieldOption[];
  readOnly?: boolean;
  renderButtonName?: (option: ButtonsFieldOption) => React.ReactNode;
  trueFalse?: boolean;
  valueName?: string;
  vertical?: boolean;
};

const ButtonsField: React.FC<ButtonsFieldProps> = ({
  input,
  meta,
  block = true,
  buttonsPerRow,
  codeName = "code",
  disabled,
  equalWidth,
  options = [],
  readOnly,
  renderButtonName,
  trueFalse,
  valueName = "name",
  vertical,
}) => {
  const buttonClickHandler = (
    option: ButtonsFieldOption
  ): React.MouseEventHandler<HTMLButtonElement> => (event) => {
    const value = trueFalse ? option[codeName] : option;

    input.onFocus(event);
    input.onChange(value);
    input.onBlur(value);
  };

  const metaError = getMetaError(meta);

  return (
    <ErrorTooltip data-name={input.name} error={metaError} tabIndex={-1}>
      {buttonsPerRow ? (
        <Row className="mx-n1" xs={buttonsPerRow}>
          {options.map((option) => (
            <Col
              key={`${input.name}-${option[codeName]}`}
              className="px-1 mb-2"
            >
              <Item
                block
                color={metaError ? "danger" : "primary"}
                disabled={disabled || readOnly}
                onClick={buttonClickHandler(option)}
                outline={
                  trueFalse
                    ? option[codeName] !== input.value
                    : option[codeName] !== input.value[codeName]
                }
                type="button"
              >
                {renderButtonName
                  ? renderButtonName(option)
                  : option[valueName]}
              </Item>
            </Col>
          ))}
        </Row>
      ) : (
        <ButtonGroup
          className={classNames(block && "d-flex")}
          vertical={vertical}
        >
          {options.map((option) => (
            <Item
              key={`${input.name}-${option[codeName]}`}
              className={classNames(block && equalWidth && "w-100")}
              color={metaError ? "danger" : "primary"}
              disabled={disabled || readOnly}
              onClick={buttonClickHandler(option)}
              outline={
                trueFalse
                  ? option[codeName] !== input.value
                  : option[codeName] !== input.value[codeName]
              }
              type="button"
            >
              {renderButtonName ? renderButtonName(option) : option[valueName]}
            </Item>
          ))}
        </ButtonGroup>
      )}
    </ErrorTooltip>
  );
};

export default ButtonsField;
