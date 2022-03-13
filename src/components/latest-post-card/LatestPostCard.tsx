import React from "react";
import Image from "next/image";
import styles from "styles/LatestPostCard.module.css";

export const LatestPostCard = () => {
  return (
    <div className={styles.container}>
      <img src="/main.jpg" alt="Latest trip pic" />
    </div>
  );
};
