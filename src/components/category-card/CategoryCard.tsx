import { faAnglesDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Config from "Config";
import { CategoriesEnum } from "enums/categories";
import { useCardClasses } from "hooks/useCardClasses";
import { useFadeInColorAnimation } from "hooks/useFadeInColorAnimation";
import { useScrollDown } from "hooks/useScrollDown";
import Link from "next/link";
import React, { FC, useMemo, useRef } from "react";
import styles from "styles/Postcard.module.css";
import { Category } from "types/PostPage.types";

type CategoryCardProps = {
  category: Category & { originalName: string };
  postIds: string[];
  isMainCard: boolean;
  displayScrollDownButton?: boolean;
  categoryType: CategoriesEnum;
};

export const CategoryCard: FC<CategoryCardProps> = ({
  category: { url, name, originalName },
  postIds,
  isMainCard,
  displayScrollDownButton = true,
  categoryType,
}) => {
  const postCardRef = useRef<HTMLDivElement>(null);
  const { isAnimationTriggered } = useFadeInColorAnimation({
    isMainCard: true,
    cardRef: postCardRef,
  });
  const scrollDown = useScrollDown("card-list");

  const {
    imageClass,
    buttonClass,
    scrollDownIconClass,
    titleClass,
    textBoxClass,
  } = useCardClasses({
    isMainCard: false,
    isTop: false,
    isAnimationTriggered,
    styles,
  });

  const randomBackgroundId = useMemo(() => shuffleBackgroundImage(postIds), []);
  const title = name.concat(originalName ? ` (${originalName})` : "");
  const backgroundImageUrl = `url(/${randomBackgroundId}/main.${Config.DEFAULT_IMAGE_EXTENSION}), url(/${categoryType}/fallback.jpg)`;

  return (
    <div className={styles.container} ref={postCardRef}>
      {isMainCard && displayScrollDownButton && (
        <FontAwesomeIcon
          className={scrollDownIconClass}
          icon={faAnglesDown}
          onClick={scrollDown}
        />
      )}
      <div
        style={{
          backgroundImage: backgroundImageUrl,
        }}
        className={imageClass}
      ></div>
      <div className={textBoxClass}>
        <h1 className={titleClass}>{title}</h1>
        <Link href={`/${categoryType}/${url}`}>
          <a style={{ display: "inline-block" }}>
            <button className={buttonClass}>{`See ${postIds.length} trip${
              postIds.length > 1 ? "s" : ""
            }`}</button>
          </a>
        </Link>
      </div>
    </div>
  );
};

function shuffleBackgroundImage(postIds: string[]): string {
  const min = 0;
  const max = postIds.length;

  const idIndex = Math.floor(Math.random() * (max - min) + min);

  return postIds[idIndex];
}
