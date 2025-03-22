import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import React, { Dispatch, FC, SetStateAction, useRef } from "react";
import styles from "styles/SearchInput.module.css";

type SearchInputProps = {
  setSearchTerm: Dispatch<SetStateAction<string>>;
  isLoading: boolean;
};

export const SearchInput: FC<SearchInputProps> = ({ setSearchTerm, isLoading }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const setValue = () => {
    const inputValue = inputRef.current?.value ?? "";
    setSearchTerm(inputValue);
  };

  const buttonClassnames = clsx(styles["button"], isLoading && styles["button-disabled"]);

  return (
    <div className={styles["container"]}>
      <input
        ref={inputRef}
        className={styles["input"]}
        type="text"
        placeholder="Trip to find..."
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.code === "Enter") {
            setValue();
          }
        }}
      />
      <button disabled={isLoading} onClick={setValue} className={buttonClassnames}>
        <FontAwesomeIcon icon={faSearch} fontSize={24} />
      </button>
    </div>
  );
};
