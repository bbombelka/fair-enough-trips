"use client";

import React, { FC, useState, useRef } from "react";
import { Link } from "components/link/Link";
import styles from "styles/ReferencedTrips.module.css";
import { ReferencedTrip } from "../GearTemplate.types";
import { Activities, Regions, Countries } from "enums/categories";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp, faLink } from "@fortawesome/free-solid-svg-icons";

export interface ReferencedTripsProps {
  referencedTrips: ReferencedTrip[];
}

export const ReferencedTrips: FC<ReferencedTripsProps> = ({ referencedTrips }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  if (referencedTrips.length === 0) return null;

  const formatTripName = (trip: ReferencedTrip) => {
    const { title, difficulty, category } = trip;
    let formattedName = title;

    if (difficulty) {
      formattedName += ` [${difficulty}]`;
    }

    if (category) {
      const activityCode = category.activity?.[0];
      const regionCode = category.region?.[0];
      const countryCode = category.country?.[0];

      const activity = activityCode ? Activities.find((act) => act.code === activityCode)?.name.toLowerCase() : "";
      const region = regionCode ? Regions.find((reg) => reg.code === regionCode)?.name : "";
      const country = countryCode ? Countries.find((c) => c.code === countryCode)?.name : "";

      const parts: string[] = [];
      if (activity && region) {
        parts.push(`${activity} in ${region}`);
      } else if (region) {
        parts.push(region);
      } else if (activity) {
        parts.push(activity);
      }

      if (country) {
        parts.push(country);
      }

      if (parts.length > 0) {
        formattedName += ` (${parts.join(", ")})`;
      }
    }

    return formattedName;
  };

  const handleToggle = () => {
    if (isExpanded) {
      containerRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    setIsExpanded(!isExpanded);
  };

  const displayedTrips = isExpanded ? referencedTrips : referencedTrips.slice(0, 5);
  const showButton = referencedTrips.length > 5;

  return (
    <div ref={containerRef}>
      <ul className={`${styles.list} ${styles.listUnordered}`}>
        {displayedTrips.map((trip) => {
          const href = trip.parentId ? `/posts/${trip.parentId}/${trip.id}` : `/posts/${trip.id}`;
          return (
            <li key={trip.id} className={styles.listItem}>
              <Link
                href={href}
                className={styles.tripLink}
                name={
                  <>
                    <span className={styles.tripText}>{formatTripName(trip)}</span>
                    <FontAwesomeIcon icon={faLink} className={styles.linkIcon} />
                  </>
                }
              />
            </li>
          );
        })}
      </ul>
      {showButton && (
        <button
          className={styles.expandButton}
          onClick={handleToggle}
          aria-label={isExpanded ? "Hide full list" : "Show full list"}
          title={isExpanded ? "Hide full list" : "Show full list"}
        >
          <span className={styles.buttonCaption}>{isExpanded ? "Hide full list" : "Show full list"}</span>
          <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} />
        </button>
      )}
    </div>
  );
};
