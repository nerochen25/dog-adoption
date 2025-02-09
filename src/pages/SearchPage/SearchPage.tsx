import React from "react";
import { User } from "../../types";

interface SearchPageProps {
  user: User;
  onLogout: () => void;
}

const SearchPage: React.FC<SearchPageProps> = ({ user, onLogout }) => {
  const handleLogoutClick = async () => {
    try {
      onLogout();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <div>
        <h1>Welcome, {user.name}!</h1>
        <button onClick={handleLogoutClick}>Logout</button>
      </div>
    </div>
  );
};

export default SearchPage;
