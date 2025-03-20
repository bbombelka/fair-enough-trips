import { SearchInput } from "components/search-input/SearchInput";
import React from "react";
import styles from "styles/Navbar.module.css";
import searchBarStyles from "styles/SearchBar.module.css";

export const SearchBar = () => {
  return (
    <div className={`${styles["navbar"]} ${searchBarStyles["searchbar"]}`}>
      <SearchInput />
    </div>
  );
};
