import { Box } from "components/box/Box";
import Config from "Config";
import { useCardClasses } from "hooks/useCardClasses";
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
}) => {
  const postCardRef = useRef<HTMLDivElement>(null);
  const scrollDownTrips = useScrollDown("card-list");
  const scrollDownNotes = useScrollDown("trip-notes");

  const { imageClass, buttonClass, titleClass, textBoxClass, imageContainerClass, containerClass } = useCardClasses({
    isMainCard,
    isTop: false,
    styles,
  });

  const title = name.concat(originalName ? ` (${originalName})` : "");

  return (
    <div className={containerClass} ref={postCardRef}>
      <div className={imageContainerClass}>
        <FETImage
          src={`/${id}/main.${Config.DEFAULT_IMAGE_EXTENSION}`}
          className={imageClass}
          blurDataURL={blurDataURL}
          alt="Main category picture"
          placeholder="blur"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className={textBoxClass}>
        <h1 className={titleClass}>{title}</h1>
        <NextLink
          href={isMainCard ? "" : `/${categoryType}/${url}`}
          style={{ display: "block" }}
          onClick={(e) => {
            if (isMainCard) {
              e.preventDefault();
              scrollDownTrips();
            }
          }}
        >
          <button className={buttonClass}>{`See ${postIds.length} trip${postIds.length > 1 ? "s" : ""}`}</button>
        </NextLink>
        {isMainCard && areNotesPresent && (
          <Box margin="12px 0">
            <NextLink
              href={`/${categoryType}/${url}`}
              style={{ display: "block" }}
              onClick={(e) => {
                e.preventDefault();
                scrollDownNotes();
              }}
            >
              <button className={buttonClass}>Read trip notes</button>
            </NextLink>
          </Box>
        )}
      </div>
    </div>
  );
};
