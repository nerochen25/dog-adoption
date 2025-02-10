import React from "react";
import { Dog } from "../../types";
import DogCard from "../DogCard/DogCard";
import styles from "./FavoritePanel.module.css";

interface FavoritesPanelProps {
  favorites: Dog[];
  onMatch: () => void;
  onFavoriteToggle: (dog: Dog) => void;
}

const FavoritesPanel: React.FC<FavoritesPanelProps> = ({
  favorites,
  onMatch,
  onFavoriteToggle,
}) => {
  return (
    <div className={styles.root}>
      <h3>Favorites</h3>
      {favorites.length === 0 ? (
        <p>No favorites selected.</p>
      ) : (
        <div className={styles.favorite_list}>
          {favorites.map((dog, index) => (
            <DogCard
              key={dog.id}
              index={index}
              dog={dog}
              isFavorite={true}
              onFavoriteToggle={onFavoriteToggle}
            />
          ))}
        </div>
      )}
      <button
        className={styles.generate_match_btn}
        onClick={onMatch}
        disabled={favorites.length === 0}
      >
        Generate Match
      </button>
    </div>
  );
};

export default FavoritesPanel;
