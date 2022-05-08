import React, { FC } from "react";
import styles from "styles/PostCardList.module.css";
import { CardListProps } from "./CardList.types";

export const CardList: FC<CardListProps> = ({ listTitle, children }) => {
  return (
    <div id="card-list" className={styles.container}>
      <h1 className={styles.title}>{listTitle}</h1>
      <div className={styles["post-card-list"]}>{children}</div>
    </div>
  );
};
