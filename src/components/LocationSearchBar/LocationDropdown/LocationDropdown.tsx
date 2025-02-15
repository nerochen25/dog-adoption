import React, { useRef, useEffect } from "react";
import { Location } from "../../../services/api";
import styles from "./LocationDropdown.module.css";

interface LocationDropdownProps {
  suggestions: Location[];
  loading: boolean;
  onSelect: (zipCode: string, displayText: string) => void;
  onClose: () => void;
}

const LocationDropdown: React.FC<LocationDropdownProps> = ({
  suggestions,
  loading,
  onSelect,
  onClose,
}) => {
  const dropdownRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <ul className={styles.dropdown} ref={dropdownRef}>
      {suggestions.length === 0 ? (
        <li className={styles.option} aria-disabled>
          {loading ? "Loading..." : "No results"}
        </li>
      ) : (
        suggestions.map((loc) => (
          <li
            key={loc.zip_code}
            className={styles.option}
            onClick={() =>
              onSelect(
                loc.zip_code,
                `${loc.city}, ${loc.state} (${loc.zip_code})`
              )
            }
          >
            {`${loc.city}, ${loc.state} (${loc.zip_code})`}
          </li>
        ))
      )}
    </ul>
  );
};

export default LocationDropdown;
