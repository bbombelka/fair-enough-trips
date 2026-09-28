"use client";

import React, { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import { useTheme } from "context/theme/ThemeContext";
import styles from "styles/ThemeToggle.module.css";
import { ThemeToggleProps } from "./ThemeToggle.types";

export const ThemeToggle: FC<ThemeToggleProps> = ({ className, size }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      className={clsx(styles["theme-toggle-btn"], className)}
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      data-testid="theme-toggle-btn"
    >
      <FontAwesomeIcon
        className={styles.icon}
        icon={isDark ? faSun : faMoon}
        size={size}
        aria-hidden="true"
      />
    </button>
  );
};
