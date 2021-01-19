import * as React from "react";
import { WrappedFieldProps as ReduxFormFieldProps } from "redux-form";
import Select, { Props as ReactSelectProps } from "react-select";
import classNames from "classnames";

import ErrorTooltip from "../ErrorTooltip";
import { getMetaError } from "../utils";

export type SelectFieldProps = ReduxFormFieldProps &
  ReactSelectProps & {
    disabled?: boolean;
    id?: React.InputHTMLAttributes<HTMLInputElement>["id"];
    isClearable?: ReactSelectProps["isClearable"];
    isMulti?: ReactSelectProps["isMulti"];
    isOptionDisabled?: ReactSelectProps["isOptionDisabled"];
    isSearchable?: ReactSelectProps["isSearchable"];
    maxItems?: number;
    maxItemsError?: (maxItems?: number) => string;
    menuPlacement?: ReactSelectProps["menuPlacement"];
    noOptionsMessage?: ReactSelectProps["noOptionsMessage"];
    optionLabel?: string;
    options?: ReactSelectProps["options"];
    optionValue?: string;
    placeholder?: React.InputHTMLAttributes<HTMLInputElement>["placeholder"];
    processValuesBeforeSelect?: (values: any) => any;
    readOnly?: React.InputHTMLAttributes<HTMLInputElement>["readOnly"];
  };

const SelectField: React.FC<SelectFieldProps> = ({
  input,
  meta,
  disabled,
  formatOptionLabel,
  id,
  isClearable,
  isMulti,
  isOptionDisabled,
  isSearchable,
  maxItems = 99,
  maxItemsError = (maxItems) => `Максимальное количество опций - ${maxItems}`,
  menuPlacement,
  noOptionsMessage = () => "Нет опций для выбора",
  optionLabel = "name",
  options,
  optionValue = "code",
  placeholder,
  processValuesBeforeSelect = (values) => values,
  readOnly,
  ...rest
}) => {
  const [menuOpenState, setMenuOpenState] = React.useState(false);
  const [staticErrorState, setStaticErrorState] = React.useState("");

  const blurHandler = () => input.onBlur(input.value);

  const changeHandler: ReactSelectProps["onChange"] = (value) => {
    const valueProcessed = processValuesBeforeSelect(value);

    if (maxItems && isMulti && valueProcessed) {
      if (valueProcessed.length > maxItems) {
        setStaticErrorState(maxItemsError(maxItems));
        valueProcessed.splice(-1, 1);
      } else {
        setStaticErrorState("");
      }
    }
    input.onChange(valueProcessed);
  };

  const menuCloseHandler = () => setMenuOpenState(false);

  const menuOpenHandler = () => {
    setMenuOpenState(true);
    setStaticErrorState("");
  };

  const metaError = getMetaError(meta);
  const error =
    staticErrorState && !menuOpenState && meta.active
      ? staticErrorState
      : metaError;

  return (
    <ErrorTooltip
      className={menuOpenState ? "SelectFieldOpened" : "SelectFieldClosed"}
      data-name={input.name}
      error={error}
    >
      <Select
        {...input}
        {...rest}
        blurInputOnSelect={!!metaError || !!staticErrorState}
        className={classNames("SelectField", error && "SelectFieldError")}
        classNamePrefix="SelectFieldInner"
        formatOptionLabel={formatOptionLabel}
        getOptionLabel={(option) => option[optionLabel]}
        getOptionValue={(option) => option[optionValue]}
        id={id || input.name.replace(/(\.|\[|\])/g, "-")}
        isClearable={isClearable}
        isDisabled={disabled || readOnly}
        isMulti={isMulti}
        isOptionDisabled={isOptionDisabled}
        isSearchable={isSearchable}
        maxMenuHeight={200}
        menuPlacement={menuPlacement}
        noOptionsMessage={noOptionsMessage}
        onBlur={blurHandler}
        onChange={changeHandler}
        onMenuClose={menuCloseHandler}
        onMenuOpen={menuOpenHandler}
        options={options}
        placeholder={placeholder}
        readOnly={readOnly}
      />
    </ErrorTooltip>
  );
};

export default SelectField;
