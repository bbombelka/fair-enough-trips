import React, { FC } from "react";
import styles from "styles/PostCardList.module.css";
import { CardListProps } from "./CardList.types";
import clsx from "clsx";

const CardList: FC<CardListProps> = ({ listTitle, children, dropGrid }) => {
  const listClassname = clsx(styles["post-card-list"], dropGrid && styles["drop-grid"]);
  return (
    <div id="card-list" className={styles.container}>
      <h1 className={styles.title}>{listTitle}</h1>
      <div className={listClassname}>{children}</div>
    </div>
  );
};

export default CardList;
