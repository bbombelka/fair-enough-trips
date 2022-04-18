import clsx from "clsx";
import { PostCardProps } from "components/post-card/PostCard.types";
import Config from "Config";
import { useVisibleVerticalThreshold } from "hooks/useVisibleVerticalThreshold";

import Link from "next/link";
import React, { FC, useEffect, useRef, useState } from "react";
import styles from "styles/Postcard.module.css";

export const PostCard: FC<PostCardProps> = ({
  post: { isTop = false, title, category, id },
  isMainPostCard = false,
}) => {
  const [isAnimationTriggered, triggerAnimation] = useState(false);
  const [verticalOffset, setVerticalOffset] = useState(0);
  const postCardRef = useRef<HTMLDivElement>(null);
  const visibleVerticalThreshold = useVisibleVerticalThreshold();

  const textBoxClass = isTop ? styles.top : styles.bottom;
  const imageClass = clsx(
    styles.image,
    styles[isMainPostCard ? "main-post-card" : "grid-card"],
    isAnimationTriggered && styles["liven-up"],
  );

  const titleClass = clsx(
    styles.text,
    styles[isMainPostCard ? "title-main" : "title"],
  );

  const subtitleClass = clsx(
    styles.text,
    styles.subtitle,
    isMainPostCard && "main-post-card-subtitle",
  );

  useEffect(() => {
    if (isMainPostCard) {
      postCardRef.current?.setAttribute("id", "main-post-card");
      return triggerAnimation(true);
    }

    if (postCardRef.current) {
      const { y, height } = postCardRef.current.getBoundingClientRect();
      setVerticalOffset(y + height);
    }
  }, []);

  useEffect(() => {
    if (isMainPostCard) {
      return;
    }

    if (visibleVerticalThreshold > verticalOffset) {
      triggerAnimation(true);
    }
  }, [visibleVerticalThreshold]);

  return (
    <div className={styles.container} ref={postCardRef}>
      <div
        style={{
          backgroundImage: `url(${id}/main.${Config.DEFAULT_EXTENSION})`,
        }}
        className={imageClass}
      ></div>
      <div className={`${styles.textBox} ${textBoxClass}`}>
        <h1 className={titleClass}>{title}</h1>
        <h2 className={subtitleClass}>{category}</h2>
        <Link href={`/posts/${id}`}>
          <a>
            <button className={styles.button}>Read more</button>
          </a>
        </Link>
      </div>
    </div>
  );
};
