import React from "react";
import { Dog } from "../../types";
import DogCard from "../DogCard/DogCard";
import Button from "../Button/Button";
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
              hideDogInfo={true}
              hideFavoriteToggle={true}
              showXCloseIcon={true}
              className={styles.dog_card}
              onFavoriteToggle={onFavoriteToggle}
            />
          ))}
        </div>
      )}
      <div className={styles.generate_match_btn_container}>
        <Button
          onClick={onMatch}
          size="small"
          disabled={favorites.length === 0}
          className={styles.generate_match_btn}
        >
          Generate Match
        </Button>
      </div>
    </div>
  );
};

export default FavoritesPanel;
