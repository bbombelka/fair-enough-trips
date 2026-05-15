import { Post } from "components/card-list/CardList.types";
import { Link } from "components/link/Link";

import styles from "styles/TripSections.module.css";

import React from "react";

type TripSections = {
  subPosts: Post[];
  parentPostId: string;
};

export const TripSections = ({ subPosts, parentPostId }: TripSections) => {
  return (
    <ul className={styles.list}>
      {subPosts.map((post) => (
        <li key={post.id}>
          <Link name={post.title} href={`${parentPostId}/${post.id}`} className={styles.link} />
        </li>
      ))}
    </ul>
  );
};
