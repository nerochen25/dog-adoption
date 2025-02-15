import React from "react";
import cn from "classnames";
import { Dog } from "../../types";
import DogCard from "../DogCard/DogCard";
import styles from "./DogList.module.css";

interface DogListProps {
  dogs: Dog[];
  favorites: Dog[];
  loading?: boolean;
  onFavoriteToggle: (dog: Dog) => void;
}

const DogList: React.FC<DogListProps> = ({
  dogs,
  favorites,
  loading,
  onFavoriteToggle,
}) => {
  if (dogs.length === 0) {
    return (
      <div className={cn(styles.no_results, styles.root)}>
        <span>{loading ? "Loading..." : "No dogs found."}</span>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      {dogs.map((dog, index) => (
        <DogCard
          key={dog.id}
          dog={dog}
          index={index}
          hideStar={false}
          isFavorite={favorites.some((item) => item.id === dog.id)}
          onFavoriteToggle={onFavoriteToggle}
        />
      ))}
    </div>
  );
};

export default DogList;
