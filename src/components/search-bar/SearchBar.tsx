import { SearchInput } from "components/search-input/SearchInput";
import React, { Dispatch, SetStateAction, FC } from "react";
import styles from "styles/Navbar.module.css";
import searchBarStyles from "styles/SearchBar.module.css";

type SearchBarProps = {
  setSearchTerm: Dispatch<SetStateAction<string>>;
  isLoading: boolean;
};

export const SearchBar: FC<SearchBarProps> = ({ setSearchTerm, isLoading }) => {
  return (
    <div className={`${styles["navbar"]} ${searchBarStyles["searchbar"]}`}>
      <SearchInput setSearchTerm={setSearchTerm} isLoading={isLoading} />
    </div>
  );
};
