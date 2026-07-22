"use client";

import React, { FC } from "react";
import NextLink from "next/link";
import { GearCardProps } from "./GearCard.types";
import { useCardClasses } from "hooks/useCardClasses";
import { useGearImageSourcePath } from "hooks/useImageSourcePath";
import { GearMap } from "enums/gear";
import { FETImage } from "components/fet-image/FETImage";
import styles from "styles/PostCard.module.css";
import Config from "Config";

export const GearCard: FC<GearCardProps> = ({ gearItem }) => {
  const { slug, brand, name, type, images } = gearItem;

  const getGearImageSourcePath = useGearImageSourcePath();
  const mainImageName = images?.general?.[0];

  const { src } = mainImageName ? getGearImageSourcePath({ id: slug, filename: mainImageName }) : { src: `/placeholder.${Config.DEFAULT_IMAGE_EXTENSION}` };

  const { imageClass, subtitleClass, titleClass, textBoxClass, imageContainerClass, containerClass } = useCardClasses({
    isMainCard: false,
    isTop: false,
    styles,
  });

  const getGearCardSubtitles = () => {
    const gearTypeLabel = GearMap.get(type as any) || type;
    return (
      <>
        <span className={subtitleClass}>{brand}</span>
        <span className={subtitleClass}>{gearTypeLabel}</span>
      </>
    );
  };

  return (
    <NextLink href={`/gear/${slug}`} className={styles["post-card-link"]} data-testid="gear-card">
      <div className={containerClass}>
        <div className={imageContainerClass}>
          <FETImage className={imageClass} src={src} alt={`${brand} ${name}`} fill unoptimized={true} />
        </div>
        <div className={textBoxClass}>
          <h3 className={titleClass}>{name}</h3>
          {getGearCardSubtitles()}
        </div>
      </div>
    </NextLink>
  );
};
