import React, { useState, useEffect } from "react";
import {
  fetchBreeds,
  searchDogs,
  getDogs,
  matchDogs,
} from "../../services/api";
import DogList from "../../components/DogList/DogList";
import Pagination from "../../components/Pagination/Pagination";
import FavoritesPanel from "../../components/FavoritePanel/FavoritePanel";
import { Dog, User } from "../../types";
import { PAGE_SIZE } from "../../utils/constants";
import DogCard from "../../components/DogCard/DogCard";
import styles from "./SearchPage.module.css";

interface SearchPageProps {
  user: User;
  onLogout: () => void;
}

interface PaginationInfo {
  next: string | null;
  prev: string | null;
  total: number;
}

const API_BASE = "https://frontend-take-home-service.fetch.com";

const SearchPage: React.FC<SearchPageProps> = ({ user, onLogout }) => {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreed, setSelectedBreed] = useState<string>("");
  const [selectedZipCode, setSelectedZipCode] = useState<string>(""); // New state for location
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    next: null,
    prev: null,
    total: 0,
  });
  const [favorites, setFavorites] = useState<Dog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [matchResult, setMatchResult] = useState<string | null>(null);
  const [offset, setOffset] = useState<number>(0);

  const totalPages = Math.ceil(pagination.total / PAGE_SIZE)

  // Fetch available breeds on mount.
  useEffect(() => {
    const loadBreeds = async () => {
      try {
        const breedList = await fetchBreeds();
        setBreeds(breedList);
      } catch (error) {
        console.error("Failed to load breeds:", error);
      }
    };
    loadBreeds();
  }, []);

  // Reload dogs whenever filters change (breed, sort order, or location).
  useEffect(() => {
    setOffset(0);
    loadDogs();
  }, [selectedBreed, sortOrder, selectedZipCode]);

  // Load dogs based on filters and pagination.
  const loadDogs = async (paramsOrUrl: any = {}) => {
    setLoading(true);
    try {
      let searchResponse;
      let currentOffset = 0;

      if (typeof paramsOrUrl === "string" && paramsOrUrl.startsWith("/dogs")) {
        // For pagination: extract the 'from' parameter from the relative URL.
        const fullUrl = new URL(paramsOrUrl, API_BASE);
        currentOffset = Number(fullUrl.searchParams.get("from")) || 0;
        setOffset(currentOffset);
        searchResponse = await searchDogs(paramsOrUrl);
      } else {
        // For the initial load or when filters change, build the query parameters.
        const searchParams = {
          breeds: selectedBreed ? [selectedBreed] : [],
          sort: `breed:${sortOrder}`,
          size: 24,
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
      console.error("Error loading dogs:", error);
    }
    setLoading(false);
  };

  const handleNextPage = () => {
    if (pagination.next) {
      loadDogs(pagination.next);
    }
  };

  const handlePrevPage = () => {
    if (pagination.prev) {
      loadDogs(pagination.prev);
    }
  };

  const handleLogoutClick = async () => {
    try {
      onLogout();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleFavoriteToggle = (dog: Dog) => {
    setFavorites((prev) => {
      if (prev.some((item) => item.id === dog.id)) {
        return prev.filter((item) => item.id !== dog.id);
      } else {
        return [...prev, dog];
      }
    });
  };

  const handleMatch = async () => {
    if (favorites.length === 0) {
      alert("Please select at least one favorite dog.");
      return;
    }
    try {
      const matchResponse = await matchDogs(favorites.map((dog) => dog.id));
      setMatchResult(matchResponse.match);
    } catch (error) {
      console.error("Error generating match:", error);
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h1>Welcome, {user.name}!</h1>
        <button onClick={handleLogoutClick} className={styles.logout_btn}>
          Log out
        </button>
      </div>

      <div className={styles.filter_panel}>
        <label>
          Filter by Breed:&nbsp;
          <select
            className={styles.select}
            value={selectedBreed}
            onChange={(e) => setSelectedBreed(e.target.value)}
          >
            <option className={styles.option} value="">
              All
            </option>
            {breeds.map((breed) => (
              <option key={breed} value={breed} className={styles.option}>
                {breed}
              </option>
            ))}
          </select>
        </label>
        &nbsp;
        <button
          className={styles.sort_toggle}
          onClick={() =>
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
          }
        >
          Sort Breed: {sortOrder === "asc" ? "Ascending" : "Descending"}
        </button>
      </div>
      {loading ? (
        <p>Loading dogs...</p>
      ) : (
        <DogList
          dogs={dogs}
          favorites={favorites}
          onFavoriteToggle={handleFavoriteToggle}
        />
      )}
      {dogs.length > 0 && <Pagination
        onNext={handleNextPage}
        onPrev={handlePrevPage}
        currentPage={pagination.total === 0 ? 0 : offset / PAGE_SIZE + 1}
        totalPages={Math.ceil(pagination.total / PAGE_SIZE)}
      />}
      {dogs.length > 0 && <FavoritesPanel
        favorites={favorites}
        onMatch={handleMatch}
        onFavoriteToggle={handleFavoriteToggle}
      />}
      
      {matchResult && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Your Match</h2>
          <p>Matched Dog ID: {matchResult}</p>
          {favorites
            .filter((dog) => dog.id === matchResult)
            .map((dog, index) => (
              <DogCard
                dog={dog}
                index={index}
                isFavorite={true}
                onFavoriteToggle={(dog) => {}}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
