"use client";

import React, { FC } from "react";
import { ImageGallery } from "components/image-gallery/ImageGallery";
import { useGearImageSourcePath } from "hooks/useImageSourcePath";
import { PostImage } from "types/common.types";
import styles from "styles/GearGallery.module.css";

export interface TimelineItem {
  date: string;
  title: string;
  img: Array<{ desc: string; isVertical?: boolean }>;
  id: string;
}

export interface GearGalleryProps {
  slug: string;
  images: {
    general: Array<{ desc: string; isVertical?: boolean }>;
    timeline?: TimelineItem[];
  };
}

export const GearGallery: FC<GearGalleryProps> = ({ slug, images }) => {
  const getGearImageSourcePath = useGearImageSourcePath();

  const formatTimelineDate = (dateString?: string) => {
    if (!dateString) return "";
    const match = dateString.match(/^(\d{4})-(\d{2})/);
    if (!match) return dateString;
    const year = match[1];
    const monthIndex = parseInt(match[2], 10) - 1;
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = months[monthIndex] || "";
    return `${month} ${year}`;
  };

  const { general, timeline } = images;
  const hasGeneral = Boolean(general && general.length > 0);
  const hasTimeline = Boolean(timeline && timeline.length > 0);

  if (!hasGeneral && !hasTimeline) return null;

  console.log(general);
  return (
    <div id="gear-images">
      {hasGeneral && (
        <div className={styles.generalGalleryWrapper}>
          <h3 className={styles.timelineHeading}>{}</h3>
          <ImageGallery
            id={slug}
            galleryId={`${slug}-general`}
            images={general.map((filename, index) => ({
              filename: `${slug}-${index + 1}`,
              desc: filename.desc,
              isVertical: filename.isVertical || false,
            }))}
            getImageSourcePath={getGearImageSourcePath}
          />
        </div>
      )}

      {hasTimeline &&
        timeline!.map((item, index) => {
          const title = item.title || formatTimelineDate(item.date);
          const mappedImages: PostImage[] = item.img.map((filename, index) => ({
            filename: `${slug}-${item.id}-${index + 1}`,
            desc: filename.desc,
            isVertical: filename.isVertical || false,
          }));

          return (
            <div key={index} className={styles.timelineItemWrapper}>
              <h3 className={styles.timelineHeading}>{title}</h3>
              <ImageGallery id={slug} galleryId={`${slug}-${item.id}`} images={mappedImages} getImageSourcePath={getGearImageSourcePath} />
            </div>
          );
        })}
    </div>
  );
};
