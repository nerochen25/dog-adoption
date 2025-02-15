import React, { useCallback } from "react";
import cn from "classnames";
import { Dog } from "../../types";
import { PAGE_SIZE } from "../../utils/constants";
import Button from "../Button/Button";
import StarIcon from "../StarIcon/StarIcon";
import styles from "./DogCard.module.css";

interface DogCardProps {
  dog: Dog;
  index: number;
  isFavorite: boolean;
  hideDogInfo?: boolean;
  hideFavoriteToggle?: boolean;
  showXCloseIcon?: boolean;
  hideStar?: boolean;
  className?: string;
  onFavoriteToggle: (dog: Dog) => void;
}

const DogCard: React.FC<DogCardProps> = ({
  dog,
  index,
  isFavorite,
  hideDogInfo = false,
  hideFavoriteToggle = false,
  showXCloseIcon = false,
  hideStar = true,
  onFavoriteToggle,
  className = "",
}) => {
  const handleFavoriteClick = useCallback(() => {
    onFavoriteToggle(dog);
  }, [onFavoriteToggle, dog]);

  return (
    <div className={cn(styles.root, className)}>
      {showXCloseIcon && (
        <Button
          className={styles.x_close_btn}
          onClick={handleFavoriteClick}
          size="small"
        >
          x
        </Button>
      )}
      {!hideStar && (
        <StarIcon
          filled={isFavorite}
          className={cn(styles.star, { [styles.show_star]: isFavorite })}
          onClick={handleFavoriteClick}
        />
      )}
      <div className={styles.img_container}>
        <img
          src={dog.img}
          className={styles.img}
          alt={dog.name}
          loading={index <= PAGE_SIZE / 2 ? "eager" : "lazy"}
          srcSet={`${dog.img}?w=300 300w, ${dog.img}?w=600 600w, ${dog.img}?w=900 900w`}
          sizes="(max-width: 600px) 300px, (max-width: 900px) 600px, 900px"
        />
      </div>
      <div className={styles.dog_info}>
        <h3>{dog.name}</h3>
        {!hideDogInfo && (
          <>
            <p>Age: {dog.age}</p>
            <p>Breed: {dog.breed}</p>
            <p>Zip Code: {dog.zip_code}</p>
          </>
        )}
      </div>
      {!hideFavoriteToggle && (
        <Button
          onClick={handleFavoriteClick}
          size="small"
          className={styles.add_to_fav_btn}
        >
          {isFavorite ? "Remove Favorite" : "Add to Favorites"}
        </Button>
      )}
    </div>
  );
};

export default React.memo(DogCard);
