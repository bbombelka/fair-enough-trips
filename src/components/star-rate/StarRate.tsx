import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Config from "Config";
import React, { FC, useEffect, useState } from "react";
import { faStar as SolidStarIcon } from "@fortawesome/free-solid-svg-icons";
import { faStar as HollowStarIcon } from "@fortawesome/free-regular-svg-icons";

type StarRateProps = {
  rate: number;
  comment?: string;
};

export const StarRate: FC<StarRateProps> = ({ rate, comment }) => {
  const getStarsBlueprint = (count: number, type: "solid" | "light") => {
    return new Array(count).fill(type);
  };

  const [stars, setStars] = useState(() => getStarsBlueprint(Config.MAX_STARS_COUNT, "light"))
  const [solidStarsCount, setSolidStarsCount] = useState(() =>rate)

  function drawStars(stars: number) {
       setTimeout(() => {
         setStars(stars => ["solid", ...stars])
         setSolidStarsCount(stars -1)
      }, 500)
  }

  useEffect(()=> {
    if(solidStarsCount > 0){
      drawStars(solidStarsCount)
    }
  }, [solidStarsCount])

  return (
    <div>
      {stars.slice(0,Config.MAX_STARS_COUNT).map((name, i) => (
        <FontAwesomeIcon className="font-grey" key={i} icon={name === "light" ? HollowStarIcon : SolidStarIcon} />
      ))}
      {comment && <span>{comment}</span>}
    </div>
  );
};
