import React, { useState, useEffect } from "react";
import {
  searchLocations,
  Location,
  LocationSearchResponse,
} from "../../services/api";
import LocationDropdown from "./LocationDropdown/LocationDropdown";
import Input from "../Input/Input";
import Modal from "../Modal/Modal";
import styles from "./LocationSearchBar.module.css";

interface LocationSearchBarProps {
  onSelectLocation: (zipCode: string, displayText: string) => void;
}

const LocationSearchBar: React.FC<LocationSearchBarProps> = ({
  onSelectLocation,
}) => {
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const response: LocationSearchResponse = await searchLocations({
          city: query,
          size: 10000,
        });
        // Filter results based on query matching city or zip_code.
        const filteredResults = response.results.filter(
          (loc) =>
            loc.city.toLowerCase().includes(query.toLowerCase()) ||
            loc.zip_code.includes(query)
        );
        setSuggestions(filteredResults);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
          console.error(
            "Error searching locations:",
            error.message,
            error.name
          );
        } else {
          setError("An unknown error occurred");
          console.error("Error searching locations:", error);
        }
      }
      setLoading(false);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSelect = (zipCode: string, displayText: string) => {
    onSelectLocation(zipCode, displayText);
    setQuery("");
    setSuggestions([]);
    setIsDropdownOpen(false);
  };

  return (
    <div className={styles.container}>
      <label htmlFor="location-search" className={styles.label}>
        Location:
      </label>
      <Input
        type="text"
        id="location-search"
        value={query}
        onChange={(e) => {
          const value = e.target.value;
          if (!value.trim()) {
            setIsDropdownOpen(false);
          } else {
            setIsDropdownOpen(true);
          }
        }}
        onDebouncedChange={(value) => setQuery(value.trim())}
        placeholder="Search by City"
        className={styles.input}
      />
      {isDropdownOpen && (
        <LocationDropdown
          suggestions={suggestions}
          onSelect={handleSelect}
          loading={loading}
          onClose={() => setIsDropdownOpen(false)}
        />
      )}

      <Modal
        isOpen={Boolean(error)}
        onClose={() => setError(null)}
        title={"❌  Error"}
        className={styles.error_modal}
      >
        <p className={styles.error_content}>{error}</p>
      </Modal>
    </div>
  );
};

export default LocationSearchBar;
