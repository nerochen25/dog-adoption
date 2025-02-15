import React, { useState, useEffect, useCallback, useMemo } from "react";
import debounce from "lodash/debounce";
import styles from "./Input.module.css";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onDebouncedChange?: (value: string) => void;
  debounceDelay?: number;
}

const Input: React.FC<InputProps> = ({
  onDebouncedChange,
  debounceDelay = 300,
  value: propValue,
  onChange,
  ...rest
}) => {
  const [value, setValue] = useState<string>(propValue?.toString() || "");

  // Update internal state when the prop value changes.
  useEffect(() => {
    setValue(propValue?.toString() || "");
  }, [propValue]);

  // Create a debounced version of the onDebouncedChange callback.
  const debouncedChange = useMemo(
    () =>
      debounce((val: string) => {
        if (onDebouncedChange) {
          onDebouncedChange(val);
        }
      }, debounceDelay),
    [debounceDelay, onDebouncedChange]
  );

  // Clean up the debounce on unmount.
  useEffect(() => {
    return () => {
      debouncedChange.cancel();
    };
  }, [debouncedChange]);

  // When the input changes, update state, call the immediate onChange, and the debounced callback.
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);
      if (onChange) {
        onChange(e);
      }
      debouncedChange(newValue);
    },
    [onChange, debouncedChange]
  );

  return (
    <input
      className={styles.input}
      value={value}
      onChange={handleChange}
      {...rest}
    />
  );
};

export default Input;
