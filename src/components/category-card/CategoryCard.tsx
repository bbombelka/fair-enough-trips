import { Box } from "components/box/Box";
import Config from "Config";
import { CategoriesEnum } from "enums/categories";
import { useCardClasses } from "hooks/useCardClasses";
import { useFadeInColorAnimation } from "hooks/useFadeInColorAnimation";
import { useScrollDown } from "hooks/useScrollDown";
import Link from "next/link";
import React, { FC, useMemo, useRef } from "react";
import styles from "styles/PostCard.module.css";
import { Category } from "types/PostPage.types";

type CategoryCardProps = {
  category: Category & { originalName: string };
  postIds: string[];
  isMainCard: boolean;
  categoryType: CategoriesEnum;
  areNotesPresent?: boolean;
};

export const CategoryCard: FC<CategoryCardProps> = ({
  category: { url, name, originalName },
  postIds,
  isMainCard,
  categoryType,
  areNotesPresent,
}) => {
  const postCardRef = useRef<HTMLDivElement>(null);
  const { isAnimationTriggered } = useFadeInColorAnimation({
    isMainCard: true,
    cardRef: postCardRef,
  });
  const scrollDownTrips = useScrollDown("card-list");
  const scrollDownNotes = useScrollDown("trip-notes");

  const { imageClass, buttonClass, titleClass, textBoxClass } = useCardClasses({
    isMainCard,
    isTop: false,
    isAnimationTriggered,
    styles,
  });

  const randomBackgroundId = useMemo(() => shuffleBackgroundImage(postIds), []);
  const title = name.concat(originalName ? ` (${originalName})` : "");
  const backgroundImageUrl = `url(/${randomBackgroundId}/main.${Config.DEFAULT_IMAGE_EXTENSION}), url(/${categoryType}/fallback.jpg)`;

  return (
    <div className={styles.container} ref={postCardRef}>
      <div
        style={{
          backgroundImage: backgroundImageUrl,
        }}
        className={imageClass}
      ></div>
      <div className={textBoxClass}>
        <h1 className={titleClass}>{title}</h1>
        <Link href={isMainCard ? "" : `/${categoryType}/${url}`}>
          <a
            style={{ display: "block" }}
            onClick={(e) => {
              if (isMainCard) {
                e.preventDefault();
                scrollDownTrips();
              }
            }}
          >
            <button className={buttonClass}>{`See ${postIds.length} trip${
              postIds.length > 1 ? "s" : ""
            }`}</button>
          </a>
        </Link>
        {isMainCard && areNotesPresent && (
          <Box margin="12px 0">
            <Link href={`/${categoryType}/${url}`}>
              <a
                style={{ display: "block" }}
                onClick={(e) => {
                  e.preventDefault();
                  scrollDownNotes();
                }}
              >
                <button className={buttonClass}>{`Read trip notes`}</button>
              </a>
            </Link>
          </Box>
        )}
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
