import { faAnglesDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DateBox } from "components/date-box/DateBox";
import { PostCardProps } from "components/post-card/PostCard.types";
import Config from "Config";
import { useCardClasses } from "hooks/useCardClasses";
import { useTriggerAnimation } from "hooks/useTriggerAnimation";
import { useMappedCategories } from "hooks/useMappedCategories";
import { useScrollDown } from "hooks/useScrollDown";
import { useSetHeightProgramatically } from "hooks/useSetHeightProgramatically";
import Link from "next/link";
import React, { FC, useRef, useState } from "react";
import styles from "styles/PostCard.module.css";
import { FETImage } from "components/fet-image/FETImage";
import { checkWindowSize } from "hooks/checkWindowSize";
import { useIsMounted } from "hooks/useIsMounted";
import { useSourceImagePath } from "hooks/useSourceImagePath";

export const PostCard: FC<PostCardProps> = ({
  post: { isTop = false, title, category, id, postDate },
  isMainPostCard = false,
  displayScrollDownButton = true,
  setImageLoaded,
}) => {
  const postCardRef = useRef<HTMLDivElement>(null);
  const imageRef = useSetHeightProgramatically<HTMLDivElement>({
    enabled: isMainPostCard,
  });

  const [activities, regions, countries] = useMappedCategories(category);
  const isMounted = useIsMounted();
  const { isAnimationTriggered } = useTriggerAnimation({
    isMainCard: isMainPostCard,
    cardRef: postCardRef,
  });
  const scrollDown = useScrollDown("card-list");
  const { src, setError } = useSourceImagePath({ isMainPostCard, id });

  const { imageClass, subtitleClass, buttonClass, scrollDownIconClass, titleClass, textBoxClass, imageContainerClass } = useCardClasses({
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
      {postDate && <DateBox postDate={postDate} isMain={isMainPostCard} isTop={isTop} />}
      {isMainPostCard && displayScrollDownButton && <FontAwesomeIcon className={scrollDownIconClass} icon={faAnglesDown} onClick={scrollDown} />}
      <div ref={imageRef} className={imageContainerClass}>
        {isMounted && (
          <FETImage
            isMainImage={isMainPostCard}
            className={imageClass}
            src={src}
            alt={"Main trip picture"}
            layout="fill"
            onLoad={() => {
              setImageLoaded?.(true);
            }}
            onError={() => setError(true)}
          />
        )}
      </div>
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
