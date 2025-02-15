import React from "react";
import { User, Dog } from "../../types";
import Button from "../Button/Button";
import styles from "./HeaderPanel.module.css";

interface HeaderPanelProps {
  user: User;
  favorites: Dog[];
  onViewFavoritesToggle: () => void;
  onLogoutClick: () => void;
}

const HeaderPanel: React.FC<HeaderPanelProps> = ({
  user,
  favorites,
  onLogoutClick,
  onViewFavoritesToggle,
}) => {
  return (
    <div className={styles.header}>
      <h2>🐾 Welcome, {user.name}!</h2>
      <div className={styles.btn_container}>
        <Button
          className={styles.view_fav_btn}
          onClick={onViewFavoritesToggle}
          variant="outline"
          size="small"
        >
          View Favorites &nbsp;
          <span
            className={styles.fav_count_circle}
          >{`${favorites.length}`}</span>
        </Button>
        <Button onClick={onLogoutClick} size="small">
          Log out
        </Button>
      </div>
    </div>
  );
};

export default HeaderPanel;
