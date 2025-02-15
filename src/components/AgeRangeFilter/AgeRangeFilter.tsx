import React from "react";
import Input from "../Input/Input";
import styles from "./AgeRangeFilter.module.css";

interface AgeRangeFilterProps {
  minAge?: number;
  maxAge?: number;
  onMinAgeChange: (value: number | undefined) => void;
  onMaxAgeChange: (value: number | undefined) => void;
  className?: string;
}

const AgeRangeFilter: React.FC<AgeRangeFilterProps> = ({
  minAge,
  maxAge,
  onMinAgeChange,
  onMaxAgeChange,
}) => {
  const handleMinChange = (value: string) => {
    onMinAgeChange(value.trim() === "" ? undefined : Number(value));
  };

  const handleMaxChange = (value: string) => {
    onMaxAgeChange(value.trim() === "" ? undefined : Number(value));
  };

  return (
    <div className={styles.root}>
      <label className={styles.label}>Age Range:</label>
      <div className={styles.input_container}>
        <Input
          className={styles.input}
          type="number"
          placeholder="Min Age"
          min={0}
          max={maxAge ?? 30}
          value={minAge !== undefined ? minAge.toString() : ""}
          onDebouncedChange={handleMinChange}
        />
        <strong className={styles.separator}>&nbsp;-&nbsp;</strong>
        <Input
          className={styles.input}
          type="number"
          placeholder="Max Age"
          min={minAge ?? 0}
          max={30}
          value={maxAge !== undefined ? maxAge.toString() : ""}
          onDebouncedChange={handleMaxChange}
        />
      </div>
    </div>
  );
};

export default AgeRangeFilter;
