"use client";

import { Box } from "components/box/Box";
import Config from "Config";
import { useCardClasses } from "hooks/useCardClasses";
import { useMainImagePath } from "hooks/useMainImagePath";
import { useScrollDown } from "hooks/useScrollDown";
import NextLink from "next/link";
import React, { FC, useRef } from "react";
import styles from "styles/PostCard.module.css";
import { FETImage } from "components/fet-image/FETImage";

import type { CategoryCardProps } from "./CategoryCard.types";

export const CategoryCard: FC<CategoryCardProps> = ({
  category: { url, name, originalName },
  postIds,
  isMainCard,
  categoryType,
  areNotesPresent,
  blurDataURL,
  id,
  buttonLabel,
}) => {
  const postCardRef = useRef<HTMLDivElement>(null);
  const scrollDownTrips = useScrollDown("card-list");
  const scrollDownNotes = useScrollDown("trip-notes");

  const { src, setError } = useMainImagePath({ isMainPostCard: isMainCard, id });

  const { imageClass, buttonClass, titleClass, textBoxClass, imageContainerClass, containerClass } = useCardClasses({
    isMainCard,
    isTop: false,
    styles,
  });

  const header = (
    <h3 className={titleClass}>
      {name}
      {originalName && (
        <>
          <br />({originalName})
        </>
      )}
    </h3>
  );

  const mainCategoryCard = (
    <div className={containerClass} ref={postCardRef}>
      <div className={imageContainerClass}>
        <FETImage
          src={`/${id}/main.${Config.DEFAULT_IMAGE_EXTENSION}`}
          className={imageClass}
          blurDataURL={blurDataURL ?? undefined}
          alt="Main category picture"
          placeholder="blur"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className={textBoxClass}>
        {header}
        <button className={buttonClass} style={{ display: "block", cursor: "pointer" }} onClick={scrollDownTrips}>
          {`See ${postIds.length} trip${postIds.length > 1 ? "s" : ""}`}
        </button>
        {areNotesPresent && (
          <Box margin="12px 0">
            <button className={buttonClass} style={{ display: "block", cursor: "pointer" }} onClick={scrollDownNotes}>
              {buttonLabel}
            </button>
          </Box>
        )}
      </div>
    </div>
  );

  const regularCategoryCard = (
    <NextLink href={`/${categoryType}/${url}`} className={styles["post-card-link"]}>
      <div className={containerClass}>
        <div className={imageContainerClass}>
          <FETImage
            src={src}
            className={imageClass}
            blurDataURL={blurDataURL ?? undefined}
            alt="Main category picture"
            placeholder="blur"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setError(true)}
            unoptimized={true}
          />
        </div>
        <div className={textBoxClass}>{header}</div>
      </div>
    </NextLink>
  );

  if (isMainCard) {
    return mainCategoryCard;
  }

  return regularCategoryCard;
};
