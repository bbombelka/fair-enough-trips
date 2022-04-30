import { faAnglesDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { DateBox } from "components/date-box/DateBox";
import { PostCardProps } from "components/post-card/PostCard.types";
import Config from "Config";
import { useMappedCategories } from "hooks/useMappedCategories";
import { useVisibleVerticalThreshold } from "hooks/useVisibleVerticalThreshold";
import Link from "next/link";
import React, { FC, useEffect, useRef, useState } from "react";
import styles from "styles/Postcard.module.css";

export const PostCard: FC<PostCardProps> = ({
  post: { isTop = false, title, category, id, postDate },
  isMainPostCard = false,
  displayScrollDownButton = true,
}) => {
  const [isAnimationTriggered, triggerAnimation] = useState(false);
  const [verticalOffset, setVerticalOffset] = useState(0);
  const postCardRef = useRef<HTMLDivElement>(null);
  const visibleVerticalThreshold = useVisibleVerticalThreshold();
  const [activities, regions, countries] = useMappedCategories(category);
  const textBoxClass = clsx(
    styles.textBox,
    isTop ? styles.top : styles.bottom,
    isMainPostCard && styles.main,
  );

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
    styles[isMainPostCard ? "main-post-card-subtitle" : "subtitle"],
  );

  const scrollDownIcon = clsx(
    styles["scroll-down-icon"],
    isTop && styles["is-top"],
  );

  const buttonClass = clsx(styles.button, isMainPostCard && styles.main);

  const firstSubtitle = `${activities.join("/")} in ${regions.join(", ")}`;
  const secondSubtitle = countries.join(", ");

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
      <DateBox postDate={postDate} isMain={isMainPostCard} isTop={isTop} />
      {isMainPostCard && displayScrollDownButton && (
        <FontAwesomeIcon
          className={scrollDownIcon}
          icon={faAnglesDown}
          onClick={scrollDown}
        />
      )}
      <div
        style={{
          backgroundImage: `url(/${id}/main.${Config.DEFAULT_IMAGE_EXTENSION})`,
        }}
        className={imageClass}
      ></div>
      <div className={textBoxClass}>
        <h1 className={titleClass}>{title}</h1>
        <h2 className={subtitleClass}>{firstSubtitle}</h2>
        <h2 className={subtitleClass}>{secondSubtitle}</h2>
        <Link href={`/posts/${id}`}>
          <a style={{ display: "inline-block" }}>
            <button className={buttonClass}>Read more</button>
          </a>
        </Link>
      </div>
    </div>
  );
};

function scrollDown() {
  const navbarMargin = 60;
  const listTitleTopMargin = 20;
  const offsetTop = document.getElementById("post-card-list")?.offsetTop!;
  window.scrollTo(0, offsetTop - navbarMargin - listTitleTopMargin);
}
