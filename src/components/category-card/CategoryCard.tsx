import { faAnglesDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Config from "Config";
import { CategoriesEnum } from "enums/categories";
import { useCardClasses } from "hooks/useCardClasses";
import { useFadeInColorAnimation } from "hooks/useFadeInColorAnimation";
import { useScrollDown } from "hooks/useScrollDown";
import Link from "next/link";
import React, { FC, useRef } from "react";
import styles from "styles/Postcard.module.css";
import { Category } from "types/PostPage.types";

type CategoryCardProps = {
  category: Category & { originalName: string };
  tripCount: number;
  isMainCard: boolean;
  displayScrollDownButton?: boolean;
  categoryType: CategoriesEnum;
};

export const CategoryCard: FC<CategoryCardProps> = ({
  category: { url, name, originalName },
  tripCount,
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

  const title = name.concat(originalName ? ` (${originalName})` : "");
  const backgroundImageUrl = `url(/${categoryType}/${url}.${Config.DEFAULT_IMAGE_EXTENSION})`;

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
            <button className={buttonClass}>{`Discover ${tripCount} trip${
              tripCount > 1 ? "s" : ""
            }`}</button>
          </a>
        </Link>
      </div>
    </div>
  );
};
