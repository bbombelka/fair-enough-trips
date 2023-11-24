import { Box } from "components/box/Box";
import Config from "Config";
import { useCardClasses } from "hooks/useCardClasses";
import { useTriggerAnimation } from "hooks/useTriggerAnimation";
import { useScrollDown } from "hooks/useScrollDown";
import { useSetHeightProgramatically } from "hooks/useSetHeightProgramatically";
import Link from "next/link";
import React, { FC, useMemo, useRef } from "react";
import styles from "styles/PostCard.module.css";
import Image from "next/image";

import type { CategoryCardProps } from "./CategoryCard.types";

export const CategoryCard: FC<CategoryCardProps> = ({
  category: { url, name, originalName },
  postIds,
  isMainCard,
  categoryType,
  areNotesPresent,
}) => {
  const postCardRef = useRef<HTMLDivElement>(null);
  const { isAnimationTriggered } = useTriggerAnimation({
    isMainCard: false,
    cardRef: postCardRef,
  });
  const scrollDownTrips = useScrollDown("card-list");
  const scrollDownNotes = useScrollDown("trip-notes");
  const imageRef = useSetHeightProgramatically<HTMLImageElement>({
    enabled: isMainCard,
  });

  const {
    imageClass,
    buttonClass,
    titleClass,
    textBoxClass,
    imageContainerClass,
  } = useCardClasses({
    isMainCard,
    isTop: false,
    isAnimationTriggered,
    styles,
  });

  const randomBackgroundId = useMemo(() => shuffleBackgroundImage(postIds), []);
  const title = name.concat(originalName ? ` (${originalName})` : "");

  return (
    <div className={styles.container} ref={postCardRef}>
      <div ref={imageRef} className={imageContainerClass}>
        <Image
          src={`/${randomBackgroundId}/main.${Config.DEFAULT_IMAGE_EXTENSION}`}
          className={imageClass}
          alt="Main category picture"
          layout="fill"
        />
      </div>
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
