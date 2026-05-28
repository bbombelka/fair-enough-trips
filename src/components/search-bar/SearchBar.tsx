import { SearchInput } from "components/search-input/SearchInput";
import React, { FC } from "react";
import styles from "styles/Navbar.module.css";
import searchBarStyles from "styles/SearchBar.module.css";
import { SearchBarProps } from "./SearchBar.types";

export const SearchBar: FC<SearchBarProps> = ({ setSearchTerm, isLoading }) => {
  return (
    <div className={`${styles["navbar"]} ${searchBarStyles["searchbar"]}`}>
      <SearchInput setSearchTerm={setSearchTerm} isLoading={isLoading} />
    </div>
  );
};
