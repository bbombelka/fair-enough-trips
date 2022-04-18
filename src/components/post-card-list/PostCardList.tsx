import { PostCard } from "components";
import React, { FC } from "react";
import styles from "styles/PostCardList.module.css";
import { PostCardListProps } from "./PostCardList.types";

export const PostCardList: FC<PostCardListProps> = ({ listTitle, posts }) => {
  const tempPosts = [...posts, ...posts];
  return (
    <div id="post-card-list" className={styles.container}>
      <h1 className={styles.title}>{listTitle}</h1>
      <div className={styles["post-card-list"]}>
        {tempPosts.map((post) => (
          <PostCard post={post} key={post.id} />
        ))}
      </div>
    </div>
  );
};
