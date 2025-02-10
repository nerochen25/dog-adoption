import React from "react";
import DogCard from "../DogCard/DogCard";
import { Dog } from "../../types";
import styles from "./DogList.module.css";

interface DogListProps {
  dogs: Dog[];
  favorites: Dog[];
  onFavoriteToggle: (dog: Dog) => void;
}

const DogList: React.FC<DogListProps> = ({
  dogs,
  favorites,
  onFavoriteToggle,
}) => {
  if (dogs.length === 0) {
    return <p>No dogs found.</p>;
  }

  return (
    <div className={styles.root}>
      {dogs.map((dog, index) => (
        <DogCard
          key={dog.id}
          dog={dog}
          index={index}
          isFavorite={favorites.some((item) => item.id === dog.id)}
          onFavoriteToggle={onFavoriteToggle}
        />
      ))}
    </div>
  );
};

export default DogList;
