import { faAnglesDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Loader } from "components";
import { DateBox } from "components/date-box/DateBox";
import { PostCardProps } from "components/post-card/PostCard.types";
import Config from "Config";
import { useCardClasses } from "hooks/useCardClasses";
import { useTriggerAnimation } from "hooks/useTriggerAnimation";
import { useMappedCategories } from "hooks/useMappedCategories";
import { useScrollDown } from "hooks/useScrollDown";
import { useSetHeightProgramatically } from "hooks/useSetHeightProgramatically";
import Link from "next/link";
import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import styles from "styles/PostCard.module.css";
import Image from "next/image";

export const PostCard: FC<PostCardProps> = ({
  post: { isTop = false, title, category, id, postDate },
  isMainPostCard = false,
  displayScrollDownButton = true,
}) => {
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const postCardRef = useRef<HTMLDivElement>(null);
  const imageRef = useSetHeightProgramatically<HTMLDivElement>({
    enabled: isMainPostCard,
  });

  const [activities, regions, countries] = useMappedCategories(category);
  const { isAnimationTriggered } = useTriggerAnimation({
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
    imageContainerClass,
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

  const stopLoading = useCallback(() => {
    setIsLoadingImage(false);
  }, []);

  useEffect(() => {
    if (isMainPostCard) {
      const preloaderImg = document.createElement("img");
      preloaderImg.src = `/${id}/main.${Config.DEFAULT_IMAGE_EXTENSION}`;
      preloaderImg.addEventListener("load", stopLoading);

      return () => preloaderImg.removeEventListener("load", stopLoading);
    }
  }, []);

  return (
    <>
      {isMainPostCard && (
        <Loader
          fullscreen
          loadingHeading="Loading trips"
          isLoading={isLoadingImage}
        />
      )}
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
        <div ref={imageRef} className={imageContainerClass}>
          <Image
            className={imageClass}
            src={`/${id}/main.${Config.DEFAULT_IMAGE_EXTENSION}`}
            alt={"Main trip picture"}
            layout="fill"
          />
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
    </>
  );
};
