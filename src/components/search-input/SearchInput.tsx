import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSearch } from "pages/api/hooks/useSearch";
import React, { useEffect, useRef } from "react";
import styles from "styles/SearchInput.module.css";

export const SearchInput = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { setSearchTerm } = useSearch({ isEnabled: true });

  const setValue = () => {
    const inputValue = inputRef.current?.value ?? "";
    setSearchTerm(inputValue);
  };

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
      <button onClick={setValue} className={styles["button"]}>
        <FontAwesomeIcon icon={faSearch} fontSize={24} />
      </button>
    </div>
  );
};
