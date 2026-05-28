"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Config from "Config";
import React, { FC, useEffect, useMemo, useState } from "react";
import { faStar as SolidStarIcon, faStarHalfStroke as HalfStarIcon } from "@fortawesome/free-solid-svg-icons";
import { faStar as HollowStarIcon } from "@fortawesome/free-regular-svg-icons";
import { StarRateProps } from "./StarRate.types";

export const StarRate: FC<StarRateProps> = ({ rate, comment, disableCount }) => {
  const getInitialStarBlueprint = (count: number, type: "empty" | "solid") => {
    return new Array(count).fill(type);
  };

  const getFinalStarBlueprint = (rate: number) => {
    const finalStarBluePrint = [];
    let count = rate;

    while (count > 0) {
      if (count < 1) {
        finalStarBluePrint.push("half");
      } else {
        finalStarBluePrint.push("solid");
      }

      count -= 1;
    }

    for (let i = Config.MAX_STARS_COUNT - finalStarBluePrint.length; i > 0; i--) {
      finalStarBluePrint.push("empty");
    }

    return finalStarBluePrint;
  };

  const [stars, setStars] = useState(() => getInitialStarBlueprint(Config.MAX_STARS_COUNT, "empty"));
  const finalStars = useMemo(() => getFinalStarBlueprint(rate), [rate]);
  const [starsDrawnCount, setStarsDrawnCount] = useState(1);

  useEffect(() => {
    setStars(getInitialStarBlueprint(Config.MAX_STARS_COUNT, "empty"));
    setStarsDrawnCount(1);
  }, [rate]);

  useEffect(() => {
    if (disableCount) {
      setStars(finalStars);
      return;
    }
    
    if (starsDrawnCount < Config.MAX_STARS_COUNT + 1) {
      const timer = setTimeout(() => {
        setStars([...finalStars.slice(0, starsDrawnCount), ...getInitialStarBlueprint(Config.MAX_STARS_COUNT, "empty")].slice(0, Config.MAX_STARS_COUNT));
        setStarsDrawnCount((prev) => prev + 1);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [starsDrawnCount, disableCount, finalStars]);

  return (
    <div>
      {stars.slice(0, Config.MAX_STARS_COUNT).map((name, i) => (
        <FontAwesomeIcon className="font-grey" key={i} icon={name === "empty" ? HollowStarIcon : name === "half" ? HalfStarIcon : SolidStarIcon} />
      ))}
      {comment && <span>{comment}</span>}
    </div>
  );
};
