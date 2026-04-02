import clsx from "clsx";
import React, { FC, useState } from "react";
import styles from "styles/Tab.module.css";

type TabProps = {
  name: string;
};

export const Tab: FC<TabProps> = ({ name, children }) => {
  const [isOpen, setOpen] = useState(false);

  const open = () => setOpen(true);
  const close = () => setOpen(false);

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
