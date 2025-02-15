import React, { useId } from "react";
import styles from "./SelectField.module.css";

export type OptionType<T extends string | number = string> =
  | T
  | { value: T; label: string };

export interface SelectFieldProps<T extends string | number = string>
  extends Omit<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    "onChange" | "value"
  > {
  label: string;
  value: T;
  options: OptionType<T>[];
  placeholder?: string | number;
  onChange: (value: T) => void;
  getOptionLabel?: (option: { value: T; label: string }) => string;
}

const SelectField = <T extends string | number>({
  label,
  value,
  options,
  onChange,
  placeholder,
  getOptionLabel,
  ...rest
}: SelectFieldProps<T>) => {
  const generatedId = useId();
  const getOptionValue = (option: OptionType<T>): T =>
    typeof option === "string" || typeof option === "number"
      ? option
      : option.value;

  const getDisplayLabel = (option: OptionType<T>): string =>
    typeof option === "string" || typeof option === "number"
      ? option.toString()
      : getOptionLabel
      ? getOptionLabel(option)
      : option.label;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value as T);
  };

  return (
    <div className={styles.selectField}>
      <label className={styles.label} htmlFor={generatedId}>
        {label}
      </label>
      <select
        id={generatedId}
        className={styles.select}
        value={value}
        onChange={handleChange}
        {...rest}
      >
        {options.map((option, index) => (
          <option
            key={index}
            value={getOptionValue(option)}
            className={styles.option}
          >
            {getDisplayLabel(option)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;
