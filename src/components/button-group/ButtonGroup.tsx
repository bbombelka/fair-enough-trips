import clsx from "clsx";
import React, { useState } from "react";
import styles from "styles/ButtonGroup.module.css";

type ButtonGroupProps<T> = {
  onSelect: (arg0: T) => void;
  options: T[];
  selectedOption: T;
};

const ButtonGroup = <T extends string>({ options, onSelect, selectedOption }: ButtonGroupProps<T>) => {
  const handleClick = (option: T) => {
    onSelect?.(option);
  };

  return (
    <div className={styles["container"]}>
      {options.map((option) => (
        <button
          key={option}
          onClick={() => handleClick(option)}
          className={clsx(styles["group-button"], selectedOption === option && styles["group-button-selected"])}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default ButtonGroup;
