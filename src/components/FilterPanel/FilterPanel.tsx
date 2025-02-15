import React from "react";
import SelectField from "../SelectField/SelectField";
import AgeRangeFilter from "../AgeRangeFilter/AgeRangeFilter";
import LocationSearchBar from "../LocationSearchBar/LocationSearchBar";
import Button from "../Button/Button";
import styles from "./FilterPanel.module.css";

type SortedOrder = "asc" | "desc";
type SortedName = "breed" | "name" | "age";

export interface SelectedZip {
  zip: string;
  displayText: string;
}

interface FilterPanelProps {
  selectedBreeds: string[];
  breeds: string[];
  onSelectedBreedsChange: (value: string) => void;
  sortedBy: SortedName;
  onSortedByChange: (value: SortedName) => void;
  sortOrder: SortedOrder;
  onSortOrderChange: (value: SortedOrder) => void;
  ageMin?: number;
  ageMax?: number;
  onMinAgeChange: (value: number | undefined) => void;
  onMaxAgeChange: (value: number | undefined) => void;
  onSelectLocation: (zip: string, displayText: string) => void;
  selectedZipCodes: SelectedZip[];
  onBreedDelete: (breed: string) => void;
  onZipCodeDelete: (zip: string) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  selectedBreeds,
  breeds,
  onSelectedBreedsChange,
  sortedBy,
  onSortedByChange,
  sortOrder,
  onSortOrderChange,
  ageMin,
  ageMax,
  onMinAgeChange,
  onMaxAgeChange,
  onSelectLocation,
  selectedZipCodes,
  onBreedDelete,
  onZipCodeDelete,
}) => {
  const breedOptions = [""].concat(breeds);
  const sortedNamesOptions = (["breed", "name", "age"] as SortedName[]).map(
    (name) => ({
      value: name,
      label: name,
    })
  );
  const sortOrderOptions = [
    { label: "Ascending", value: "asc" as SortedOrder },
    { label: "Descending", value: "desc" as SortedOrder },
  ];

  return (
    <div className={styles.filter_panel}>
      <div className={styles.filter_top_panel}>
        <SelectField
          label="Filter by Breed:"
          value={""}
          options={breedOptions}
          placeholder={"Select breed"}
          onChange={onSelectedBreedsChange}
        />
        <LocationSearchBar onSelectLocation={onSelectLocation} />
        <AgeRangeFilter
          minAge={ageMin}
          maxAge={ageMax}
          onMinAgeChange={onMinAgeChange}
          onMaxAgeChange={onMaxAgeChange}
        />
        <SelectField
          label="Sort by:"
          value={sortedBy}
          options={sortedNamesOptions}
          onChange={onSortedByChange}
        />
        <SelectField<SortedOrder>
          label={`Sort ${sortedBy}:`}
          value={sortOrder}
          options={sortOrderOptions}
          onChange={onSortOrderChange}
        />
      </div>

      {(selectedBreeds.length > 0 || selectedZipCodes.length > 0) && (
        <div className={styles.filter_bottom_panel}>
          {selectedBreeds.length > 0 && (
            <div className={styles.pill_container}>
              {selectedBreeds.map((breed) => (
                <div className={styles.pill} key={breed}>
                  <span>🐶&nbsp;</span>
                  <span>{breed}</span>
                  <Button
                    size="small"
                    variant="outline"
                    className={styles.delete_btn}
                    onClick={() => onBreedDelete(breed)}
                  >
                    x
                  </Button>
                </div>
              ))}
            </div>
          )}
          {selectedZipCodes.length > 0 && (
            <div className={styles.pill_container}>
              {selectedZipCodes.map(({ zip, displayText }) => (
                <div className={styles.pill} key={zip}>
                  <span>📍&nbsp;</span>
                  <span>{displayText}</span>
                  <Button
                    size="small"
                    variant="outline"
                    className={styles.delete_btn}
                    onClick={() => onZipCodeDelete(zip)}
                  >
                    x
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
