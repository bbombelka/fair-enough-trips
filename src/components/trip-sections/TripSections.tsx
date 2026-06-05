"use client";

import { Link } from "components/link/Link";

import styles from "styles/TripSections.module.css";

import React from "react";
import { usePathname } from "next/navigation";
import { TripSectionsProps } from "./TripSections.types";

export const TripSections = ({ subPosts, parentPostId }: TripSectionsProps) => {
  const pathname = usePathname();

  return (
    <ol className={styles.list}>
      <li>
        <Link name={`Overview`} href={`/posts/${parentPostId}`} className={`${pathname?.endsWith(`/${parentPostId}`) ? styles.active : ""}`} />
      </li>
      <li aria-hidden="true" className={styles.separator}>
        |
      </li>
      {subPosts.map((post, index) => {
        const href = `/posts/${parentPostId}/${post.id}`;

        const isActive = pathname === href;

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
