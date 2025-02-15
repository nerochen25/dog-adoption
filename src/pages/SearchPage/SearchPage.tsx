import React, { useMemo, useCallback, useState, useEffect } from "react";
import {
  fetchBreeds,
  searchDogs,
  getDogs,
  matchDogs,
} from "../../services/api";
import { Dog, User } from "../../types";
import { PAGE_SIZE, API_BASE } from "../../utils/constants";
import DogList from "../../components/DogList/DogList";
import Pagination from "../../components/Pagination/Pagination";
import FavoritesPanel from "../../components/FavoritePanel/FavoritePanel";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import DogCard from "../../components/DogCard/DogCard";
import FilterPanel from "../../components/FilterPanel/FilterPanel";
import HeaderPanel from "../../components/HeaderPanel/HeaderPanel";
import Modal from "../../components/Modal/Modal";
import styles from "./SearchPage.module.css";
import Button from "../../components/Button/Button";

interface SearchPageProps {
  user: User;
  onLogout: () => void;
}

interface PaginationInfo {
  next: string | null;
  prev: string | null;
  total: number;
}
const SORT_ORDERS = [
  {
    label: "Ascending",
    value: "asc",
  },
  {
    label: "Descending",
    value: "desc",
  },
] as const;
type SortedOrder = (typeof SORT_ORDERS)[number]["value"];

const SORTED_NAMES = ["breed", "name", "age"] as const;
type SortedName = (typeof SORTED_NAMES)[number];

interface SelectedZip {
  zip: string;
  displayText: string;
}

const SearchPage: React.FC<SearchPageProps> = ({ user, onLogout }) => {
  const filterKey = `dogFilters_${user.email.toLowerCase()}`;
  const initialFilters = (() => {
    const stored = localStorage.getItem(filterKey);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (err) {
        console.error("Error parsing dogFilters from localStorage:", err);
      }
    }
    return null;
  })();

  // Initialize filter states using the saved values if available.
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>(
    initialFilters?.selectedBreeds || []
  );
  const [sortedBy, setSortedBy] = useState<SortedName>(
    initialFilters?.sortedBy || SORTED_NAMES[0]
  );
  const [sortOrder, setSortOrder] = useState<SortedOrder>(
    initialFilters?.sortOrder || SORT_ORDERS[0].value
  );
  const [selectedZipCodes, setSelectedZipCodes] = useState<SelectedZip[]>(
    initialFilters?.selectedZipCodes || []
  );
  const [ageMin, setAgeMin] = useState<number | undefined>(
    initialFilters?.ageMin
  );
  const [ageMax, setAgeMax] = useState<number | undefined>(
    initialFilters?.ageMax
  );
  const [favorites, setFavorites] = useState<Dog[]>(
    initialFilters?.favorites || []
  );
  const [matchResult, setMatchResult] = useState<string | null>(
    initialFilters?.matchResult || null
  );

  const [isMatchModalOpen, setIsMatchModalOpen] = useState<boolean>(false);
  const [breeds, setBreeds] = useState<string[]>([]);
  const [dogs, setDogs] = useState<Dog[]>([]);

  const [isViewFavoritesModalOpen, setIsViewFavoritesModalOpen] =
    useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState<number>(0);
  const [pagination, setPagination] = useState<PaginationInfo>({
    next: null,
    prev: null,
    total: 0,
  });

  const currentPage = useMemo(
    () => (pagination.total === 0 ? 0 : offset / PAGE_SIZE + 1),
    [pagination, offset]
  );
  const totalPages = useMemo(
    () => Math.ceil(pagination.total / PAGE_SIZE),
    [pagination]
  );

  const matchedDog = useMemo(() => {
    return matchResult ? favorites.find((fav) => fav.id == matchResult) : null;
  }, [matchResult, favorites]);

  // Save filter dataset to localStorage whenever any filter changes.
  useEffect(() => {
    const filters = {
      selectedBreeds,
      sortedBy,
      sortOrder,
      selectedZipCodes,
      ageMin,
      ageMax,
      favorites,
      matchResult,
    };
    localStorage.setItem(filterKey, JSON.stringify(filters));
  }, [
    selectedBreeds,
    sortedBy,
    sortOrder,
    selectedZipCodes,
    ageMin,
    ageMax,
    favorites,
    matchResult,
  ]);

  // Fetch available breeds on mount.
  useEffect(() => {
    const loadBreeds = async () => {
      try {
        const breedList = await fetchBreeds();
        setBreeds(breedList);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
          console.error("Failed to load breeds:", error.message);
        } else {
          setError("An unknown error occurred");
          console.error("Failed to load breeds:", error);
        }
      }
    };
    loadBreeds();
  }, []);

  // Combine all filters into one object.
  const filters = useMemo(
    () => ({
      selectedBreeds,
      sortedBy,
      sortOrder,
      selectedZipCodes,
      ageMin,
      ageMax,
    }),
    [selectedBreeds, sortedBy, sortOrder, selectedZipCodes, ageMin, ageMax]
  );

  // Reload dogs whenever any filter changes.
  useEffect(() => {
    setOffset(0);
    loadDogs();
  }, [filters]);

  // Load dogs based on filters and pagination.
  const loadDogs = useCallback(
    async (paramsOrUrl: any = {}) => {
      setLoading(true);
      try {
        let searchResponse;
        let currentOffset = 0;

        if (
          typeof paramsOrUrl === "string" &&
          paramsOrUrl.startsWith("/dogs")
        ) {
          // For pagination: extract the 'from' parameter from the relative URL.
          const fullUrl = new URL(paramsOrUrl, API_BASE);
          currentOffset = Number(fullUrl.searchParams.get("from")) || 0;
          setOffset(currentOffset);
          searchResponse = await searchDogs(paramsOrUrl);
        } else {
          // For the initial load or when filters change, build the query parameters.
          const zipCodes = selectedZipCodes.map(({ zip }) => zip);
          const searchParams = {
            breeds: selectedBreeds,
            zipCodes: zipCodes,
            sort: `${sortedBy}:${sortOrder}`,
            size: PAGE_SIZE,
            ...(ageMin !== undefined ? { ageMin } : {}),
            ...(ageMax !== undefined ? { ageMax } : {}),
            // If a 'from' is provided in the object, use it; otherwise, default to 0.
            ...paramsOrUrl,
          };
          if (searchParams.from) {
            currentOffset = Number(searchParams.from) || 0;
          } else {
            currentOffset = 0;
          }
          setOffset(currentOffset);
          searchResponse = await searchDogs(searchParams);
        }

        // Fetch the full dog objects based on the result IDs.
        const dogIds: string[] = searchResponse.resultIds;
        const dogsData = await getDogs(dogIds);
        setDogs(dogsData);

        // Update pagination state.
        setPagination({
          next: searchResponse.next,
          prev: searchResponse.prev,
          total: searchResponse.total,
        });
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
          console.error("Error loading dogs:", error.message, error.name);
        } else {
          setError("An unknown error occurred");
          console.error("Error loading dogs:", error);
        }
      }
      setLoading(false);
    },
    [selectedBreeds, sortOrder, sortedBy, ageMax, ageMin, selectedZipCodes]
  );

  const handleNextPage = useCallback(() => {
    if (pagination.next) {
      loadDogs(pagination.next);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pagination, loadDogs]);

  const handlePrevPage = useCallback(() => {
    if (pagination.prev) {
      loadDogs(pagination.prev);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pagination, loadDogs]);

  const handleLogoutClick = useCallback(async () => {
    try {
      onLogout();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        console.error("Logout failed:", error.message);
      } else {
        setError("An unknown error occurred");
        console.error("Logout failed:", error);
      }
    }
  }, [onLogout]);

  const handleFavoriteToggle = useCallback((dog: Dog) => {
    setFavorites((prev) => {
      if (prev.some((item) => item.id === dog.id)) {
        return prev.filter((item) => item.id !== dog.id);
      } else {
        return [...prev, dog];
      }
    });
  }, []);

  const handleMatch = useCallback(async () => {
    if (favorites.length === 0) {
      alert("Please select at least one favorite dog.");
      return;
    }
    try {
      const matchResponse = await matchDogs(favorites.map((dog) => dog.id));
      setMatchResult(matchResponse.match);
      setIsMatchModalOpen(true);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        console.error("Error generating match:", error.message);
      } else {
        setError("An unknown error occurred");
        console.error("Error generating match:", error);
      }
    }
  }, [favorites]);

  const onSelectLocation = useCallback(
    (zip: string, displayText: string) => {
      if (selectedZipCodes.some((item) => item.zip === zip)) {
        return;
      } else {
        setSelectedZipCodes((prev) => [...prev, { zip, displayText }]);
      }
    },
    [selectedZipCodes]
  );

  const onSelectedBreedsChange = useCallback((value: string) => {
    if (selectedBreeds.includes(value) || !value.trim()) return;
    setSelectedBreeds((prev) => [...prev, value]);
  }, []);

  const onSortedByChange = useCallback(
    (value: string) => setSortedBy(value as SortedName),
    []
  );

  const onMinAgeDebouncedChange = useCallback(
    (value: number | undefined) => {
      setAgeMin(value);
      if (value !== undefined && (ageMax === undefined || value > ageMax)) {
        setAgeMax(value);
      }
    },
    [ageMax]
  );

  const onMaxAgeDebouncedChange = useCallback(
    (value: number | undefined) => {
      setAgeMax(value);
      if (value !== undefined && ageMin !== undefined && value < ageMin) {
        setAgeMin(value);
      }
    },
    [ageMin]
  );

  const onSortOrderChange = useCallback(
    (value: string) => setSortOrder(value as SortedOrder),
    []
  );

  const onBreedDelete = useCallback(
    (breed: string) =>
      setSelectedBreeds((prev) => prev.filter((item) => item !== breed)),
    []
  );

  const onZipCodeDelete = useCallback(
    (zip: string) =>
      setSelectedZipCodes((prev) => prev.filter((item) => item.zip !== zip)),
    []
  );

  const onViewFavoritesToggle = useCallback(
    () => setIsViewFavoritesModalOpen(true),
    []
  );

  const onMatchModalClose = useCallback(() => setIsMatchModalOpen(false), []);

  return (
    <div className={styles.root}>
      {loading && <LoadingSpinner />}
      <div className={styles.top}>
        <HeaderPanel
          user={user}
          favorites={favorites}
          onLogoutClick={handleLogoutClick}
          onViewFavoritesToggle={onViewFavoritesToggle}
        />
        <FilterPanel
          selectedBreeds={selectedBreeds}
          breeds={breeds}
          ageMin={ageMin}
          ageMax={ageMax}
          sortedBy={sortedBy}
          sortOrder={sortOrder}
          selectedZipCodes={selectedZipCodes}
          onSelectedBreedsChange={onSelectedBreedsChange}
          onSortedByChange={onSortedByChange}
          onSortOrderChange={onSortOrderChange}
          onMinAgeChange={onMinAgeDebouncedChange}
          onMaxAgeChange={onMaxAgeDebouncedChange}
          onSelectLocation={onSelectLocation}
          onBreedDelete={onBreedDelete}
          onZipCodeDelete={onZipCodeDelete}
        />
      </div>
      <div className={styles.main_content}>
        <DogList
          loading={loading}
          dogs={dogs}
          favorites={favorites}
          onFavoriteToggle={handleFavoriteToggle}
        />
        {dogs.length > 0 && (
          <Pagination
            onNext={handleNextPage}
            onPrev={handlePrevPage}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        )}
      </div>
      <Modal
        className={styles.fav_modal}
        isOpen={isViewFavoritesModalOpen}
        onClose={() => setIsViewFavoritesModalOpen(false)}
        title="Favorites"
      >
        <FavoritesPanel
          favorites={favorites}
          onMatch={handleMatch}
          onFavoriteToggle={handleFavoriteToggle}
        />
      </Modal>

      <Modal
        isOpen={isMatchModalOpen && Boolean(matchedDog)}
        onClose={onMatchModalClose}
        title={"Your Match"}
      >
        {matchedDog && (
          <DogCard
            key={matchedDog.id}
            dog={matchedDog}
            isFavorite={true}
            hideFavoriteToggle={true}
            hideStar={false}
          />
        )}
      </Modal>

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

export default SearchPage;
