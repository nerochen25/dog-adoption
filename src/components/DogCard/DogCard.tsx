import React from "react";
import { Dog } from "../../types";
import { PAGE_SIZE } from "../../utils/constants";
import styles from "./DogCard.module.css";

interface DogCardProps {
  dog: Dog;
  index: number;
  isFavorite: boolean;
  onFavoriteToggle: (dog: Dog) => void;
}

const DogCard: React.FC<DogCardProps> = ({
  dog,
  index,
  isFavorite,
  onFavoriteToggle,
}) => {
  const handleFavoriteClick = () => {
    onFavoriteToggle(dog);
  };

  return (
    <div className={styles.root}>
      <div className={styles.img_container}>
        <img
          src={dog.img}
          className={styles.img}
          alt={dog.name}
          loading={index <= PAGE_SIZE / 2 ? "eager" : "lazy"}
          // Example of responsive images (if supported)
          srcSet={`${dog.img}?w=300 300w, ${dog.img}?w=600 600w, ${dog.img}?w=900 900w`}
          sizes="(max-width: 600px) 300px, (max-width: 900px) 600px, 900px"
        />
      </div>
      <div className={styles.dog_info}>
        <h3>{dog.name}</h3>
        <p>Age: {dog.age}</p>
        <p>Breed: {dog.breed}</p>
        <p>Zip Code: {dog.zip_code}</p>
      </div>

      <button onClick={handleFavoriteClick} className={styles.add_to_fav_btn}>
        {isFavorite ? "Remove Favorite" : "Add to Favorites"}
      </button>
    </div>
  );
};

export default DogCard;
