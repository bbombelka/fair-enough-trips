"use client";

import clsx from "clsx";
import React, { FC, useState } from "react";
import styles from "styles/Tab.module.css";
import { TabProps } from "./Tab.types";

export const Tab: FC<TabProps> = ({ name, children }) => {
  const [isOpen, setOpen] = useState(false);

  const open = () => setOpen(true);
  const close = () => setTimeout(() => setOpen(false), 500);

  const tagContentClasses = clsx(styles["tab-content"], isOpen && styles["tab-content-open"]);

  return (
    <div className={styles["container"]} onMouseEnter={open}>
      <span>{name}</span>
      <div onMouseEnter={open} onMouseLeave={close} className={tagContentClasses}>
        {children}
      </div>
    </div>
  );
};
