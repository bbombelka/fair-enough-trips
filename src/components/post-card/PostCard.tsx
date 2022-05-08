import { faAnglesDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DateBox } from "components/date-box/DateBox";
import { PostCardProps } from "components/post-card/PostCard.types";
import Config from "Config";
import { useCardClasses } from "hooks/useCardClasses";
import { useFadeInColorAnimation } from "hooks/useFadeInColorAnimation";
import { useMappedCategories } from "hooks/useMappedCategories";
import { useScrollDown } from "hooks/useScrollDown";
import Link from "next/link";
import React, { FC, useEffect, useRef, useState } from "react";
import styles from "styles/Postcard.module.css";

export const PostCard: FC<PostCardProps> = ({
  post: { isTop = false, title, category, id, postDate },
  isMainPostCard = false,
  displayScrollDownButton = true,
}) => {
  const postCardRef = useRef<HTMLDivElement>(null);
  const [activities, regions, countries] = useMappedCategories(category);
  const { isAnimationTriggered } = useFadeInColorAnimation({
    isMainCard: isMainPostCard,
    cardRef: postCardRef,
  });
  const scrollDown = useScrollDown("card-list");

  const {
    imageClass,
    subtitleClass,
    buttonClass,
    scrollDownIconClass,
    titleClass,
    textBoxClass,
  } = useCardClasses({
    isMainCard: isMainPostCard,
    isTop,
    isAnimationTriggered,
    styles,
  });

  const getPostCardSubtitles = () => {
    const firstSubtitle = `${activities.join("/")} in ${regions.join(", ")}`;
    const secondSubtitle = countries.join(", ");

    return (
      <>
        <h2 className={subtitleClass}>{firstSubtitle}</h2>
        <h2 className={subtitleClass}>{secondSubtitle}</h2>
      </>
    );
  };

  return (
    <div className={styles.container} ref={postCardRef}>
      {postDate && (
        <DateBox postDate={postDate} isMain={isMainPostCard} isTop={isTop} />
      )}

      {isMainPostCard && displayScrollDownButton && (
        <FontAwesomeIcon
          className={scrollDownIconClass}
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
        {getPostCardSubtitles()}
        <Link href={`/posts/${id}`}>
          <a style={{ display: "inline-block" }}>
            <button className={buttonClass}>Read more</button>
          </a>
        </Link>
      </div>
    </div>
  );
};
