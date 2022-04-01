import clsx from "clsx";
import { PostCardProps } from "components/post-card/PostCard.types";
import Link from "next/link";
import React, { FC } from "react";
import styles from "styles/Postcard.module.css";

export const PostCard: FC<PostCardProps> = ({
  post: { isTop = false, imageUrl, title, category, id },
  isMainPostCard = false,
}) => {
  const textBoxClass = isTop ? styles.top : styles.bottom;
  const imageClass = clsx(
    styles.image,
    styles[isMainPostCard ? "main-post-card" : "grid-card"]
  );
  // console.log(styles.container);
  return (
    <div className={styles.container}>
      <div
        style={{ backgroundImage: `url(${imageUrl})` }}
        className={imageClass}
      ></div>
      <div className={`${styles.textBox} ${textBoxClass}`}>
        <header className={`${styles.text} ${styles.title}`}>{title}</header>
        <header className={styles.text}>{category}</header>
        <Link href={`/posts/${id}`}>
          <a>
            <button className={styles.button}>Read more</button>
          </a>
        </Link>
      </div>
    </div>
  );
};
