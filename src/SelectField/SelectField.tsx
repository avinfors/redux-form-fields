import * as React from "react";
import { WrappedFieldProps as IReduxFormFieldProps } from "redux-form";
import Select, { Props as IReactSelectProps } from "react-select";

import ErrorTooltip from "../ErrorTooltip";
import { getMetaError } from "../utils";

export interface ISelectFieldProps
  extends IReduxFormFieldProps,
    IReactSelectProps {
  disabled?: boolean;
  id?: React.InputHTMLAttributes<HTMLInputElement>["id"];
  isClearable?: IReactSelectProps["isClearable"];
  isMulti?: IReactSelectProps["isMulti"];
  isOptionDisabled?: IReactSelectProps["isOptionDisabled"];
  isSearchable?: IReactSelectProps["isSearchable"];
  maxItems?: number;
  maxItemsError?: (maxItems?: number) => string;
  menuPlacement?: IReactSelectProps["menuPlacement"];
  noOptionsMessage?: IReactSelectProps["noOptionsMessage"];
  optionLabel?: string;
  options?: IReactSelectProps["options"];
  optionValue?: string;
  placeholder?: React.InputHTMLAttributes<HTMLInputElement>["placeholder"];
  processValuesBeforeSelect?: (values: any) => any;
  readOnly?: React.InputHTMLAttributes<HTMLInputElement>["readOnly"];
}

const SelectField: React.FC<ISelectFieldProps> = ({
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

  const changeHandler: IReactSelectProps["onChange"] = (value) => {
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
    <ErrorTooltip data-name={input.name} error={error}>
      <Select
        {...input}
        {...rest}
        blurInputOnSelect={!!metaError || !!staticErrorState}
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
