import * as React from "react";
import { WrappedFieldProps as ReduxFormFieldProps } from "redux-form";
import { OptionTypeBase } from "react-select";
import Select, { Props as ReactSelectProps } from "react-select/creatable";
import classNames from "classnames";

import ErrorTooltip from "../ErrorTooltip";
import { getMetaError } from "../utils";

export type SelectFieldCreatableProps<
  OptionType extends OptionTypeBase,
  IsMulti extends boolean
> = ReduxFormFieldProps &
  ReactSelectProps<OptionType, IsMulti> & {
    disabled?: boolean;
    id?: React.InputHTMLAttributes<HTMLInputElement>["id"];
    isClearable?: ReactSelectProps<OptionType, IsMulti>["isClearable"];
    isMulti?: ReactSelectProps<OptionType, IsMulti>["isMulti"];
    isOptionDisabled?: ReactSelectProps<
      OptionType,
      IsMulti
    >["isOptionDisabled"];
    isSearchable?: ReactSelectProps<OptionType, IsMulti>["isSearchable"];
    maxItems?: number;
    maxItemsError?: (maxItems?: number) => string;
    menuPlacement?: ReactSelectProps<OptionType, IsMulti>["menuPlacement"];
    noOptionsMessage?: ReactSelectProps<
      OptionType,
      IsMulti
    >["noOptionsMessage"];
    optionLabel?: string;
    options?: ReactSelectProps<OptionType, IsMulti>["options"];
    optionValue?: string;
    placeholder?: React.InputHTMLAttributes<HTMLInputElement>["placeholder"];
    processValuesBeforeSelect?: (values: any) => any;
    createOption: (inputValue: string) => OptionType;
    readOnly?: React.InputHTMLAttributes<HTMLInputElement>["readOnly"];
  };

const SelectFieldCreatable = <
  OptionType extends OptionTypeBase,
  IsMulti extends boolean
>({
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
  createOption,
  ...rest
}: SelectFieldCreatableProps<OptionType, IsMulti>): React.ReactElement => {
  const [menuOpenState, setMenuOpenState] = React.useState(false);
  const [staticErrorState, setStaticErrorState] = React.useState("");

  const blurHandler = () => input.onBlur(undefined);

  const changeHandler: ReactSelectProps<OptionType, IsMulti>["onChange"] = (
    value
  ) => {
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

  const handleCreate = (inputValue: string) => {
    const newOption = createOption(inputValue);
    let updated: Array<OptionType> | OptionType;
    if (isMulti) {
      updated = [...(input.value as Array<OptionType>)];
      updated.push(newOption);
    } else {
      updated = newOption;
    }

    const valueProcessed = processValuesBeforeSelect(updated);

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
        onCreateOption={handleCreate}
        placeholder={placeholder}
        readOnly={readOnly}
      />
    </ErrorTooltip>
  );
};

export default SelectFieldCreatable;
