import { Post } from "components/card-list/CardList.types";
import { Link } from "components/link/Link";

import styles from "styles/TripSections.module.css";

import React from "react";
import { useRouter } from "next/router";

type TripSections = {
  subPosts: Post[];
  parentPostId: string;
};

export const TripSections = ({ subPosts, parentPostId }: TripSections) => {
  const { asPath } = useRouter();

  return (
    <ol className={styles.list}>
      <li>
        <Link name={`Overview`} href={`${parentPostId}`} className={`${asPath.endsWith(`/${parentPostId}`) ? styles.active : ""}`} />
      </li>
      <li aria-hidden="true" className={styles.separator}>
        |
      </li>
      {subPosts.map((post, index) => {
        const href = `${parentPostId}/${post.id}`;

        const isActive = asPath.includes(href);

        return (
          <React.Fragment key={post.id}>
            <li>
              <Link name={`Day ${index + 1}`} href={href} className={`${isActive ? styles.active : ""}`} />
            </li>
            {index < subPosts.length - 1 && (
              <li aria-hidden="true" className={styles.separator}>
                |
              </li>
            )}
          </React.Fragment>
        );
      })}
    </ol>
  );
};
