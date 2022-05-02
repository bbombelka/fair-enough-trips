import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Config from "Config";
import React, { FC } from "react";
import { faStar as SolidStarIcon } from "@fortawesome/free-solid-svg-icons";
import { faStar as HollowStarIcon } from "@fortawesome/free-regular-svg-icons";

type StarRateProps = {
  rate: number;
  comment?: string;
};

export const StarRate: FC<StarRateProps> = ({ rate, comment }) => {
  const solidStarsCount = rate;
  const hollowStarsCount = Config.MAX_STARS_COUNT - rate;

  const getStarsBlueprint = (count: number, type: "solid" | "light") => {
    return new Array(count).fill(type);
  };

  const solidStars = getStarsBlueprint(solidStarsCount, "solid");
  const hollowStars = getStarsBlueprint(hollowStarsCount, "light");

  return (
    <div>
      {solidStars.map((_, i) => (
        <FontAwesomeIcon className="font-grey" key={i} icon={SolidStarIcon} />
      ))}
      {hollowStars.map((_, i) => (
        <FontAwesomeIcon className="font-grey" key={i} icon={HollowStarIcon} />
      ))}
      {comment && <span>{comment}</span>}
    </div>
  );
};
