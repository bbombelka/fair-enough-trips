import { PostCard } from "components";
import React, { FC } from "react";
import styles from "styles/PostCardList.module.css";
import { PostCardListProps } from "./PostCardList.types";

export const PostCardList: FC<PostCardListProps> = ({ listTitle, posts }) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{listTitle}</h1>
      <div className={styles["post-card-list"]}>
        {posts.map((post) => (
          <PostCard post={post} key={post.id} />
        ))}
      </div>
    </div>
  );
};
