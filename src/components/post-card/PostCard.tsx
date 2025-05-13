import { faAnglesDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DateBox } from "components/date-box/DateBox";
import { PostCardProps } from "components/post-card/PostCard.types";
import { useCardClasses } from "hooks/useCardClasses";
import { useMappedCategories } from "hooks/useMappedCategories";
import { useScrollDown } from "hooks/useScrollDown";
import Link from "next/link";
import React, { FC } from "react";
import styles from "styles/PostCard.module.css";
import { FETImage } from "components/fet-image/FETImage";
import { useIsMounted } from "hooks/useIsMounted";
import { useSourceImagePath } from "hooks/useSourceImagePath";

export const PostCard: FC<PostCardProps> = ({
  post: { isTop = false, title, category, id, postDate, base64Image },
  isMainPostCard = false,
  displayScrollDownButton = true,
}) => {
  const [activities, regions, countries] = useMappedCategories(category);
  const isMounted = useIsMounted();
  const scrollDown = useScrollDown("card-list");
  const { src, setError } = useSourceImagePath({ isMainPostCard, id });

  const { imageClass, subtitleClass, buttonClass, scrollDownIconClass, titleClass, textBoxClass, imageContainerClass, containerClass } = useCardClasses({
    isMainCard: isMainPostCard,
    isTop,
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
    <div className={containerClass}>
      {postDate && <DateBox postDate={postDate} isMain={isMainPostCard} isTop={isTop} />}
      {isMainPostCard && displayScrollDownButton && <FontAwesomeIcon className={scrollDownIconClass} icon={faAnglesDown} onClick={scrollDown} />}
      <div className={imageContainerClass}>
        {isMounted && (
          <FETImage
            priority={isMainPostCard}
            className={imageClass}
            src={src}
            alt={"Main trip picture"}
            layout="fill"
            placeholder="blur"
            blurDataURL={base64Image}
            onError={() => setError(true)}
          />
        )}
      </div>
      <div className={textBoxClass}>
        <h1 className={titleClass}>{title}</h1>
        {getPostCardSubtitles()}
        <Link href={`/posts/${id}`}>
          <a className={styles["post-card-link"]}>
            <button className={buttonClass}>Read more</button>
          </a>
        </Link>
      </div>
    </div>
  );
};
