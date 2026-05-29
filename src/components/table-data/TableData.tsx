import { StarRate } from "components/star-rate/StarRate";
import { FC } from "react";
import styles from "styles/TableData.module.css";
import { formatIsoDuration, parseDate } from "utils";
import { Cell } from "./components/Cell";
import { TableDataProps } from "./TableData.types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import Link from "next/link";

export const TableData: FC<TableDataProps> = ({
  post: {
    id,
    attractiveness,
    difficulty,
    terrain,
    date,
    stats: { up, down, duration, distance, highestPoint },
    condition,
    startingPoint,
    endingPoint,
  },
}) => {
  return (
    <table className={styles.container}>
      <tbody className={styles.table}>
        <Cell label="Attractiveness">
          <a href="/about#rating">
            <StarRate key={id} rate={attractiveness} />
          </a>
        </Cell>
        <Cell label="Condition">
          <a href="/about#rating">
            <StarRate key={id} rate={condition} />
          </a>
        </Cell>
        <Cell label="Distance" value={`${distance} km`}></Cell>
        <Cell label="Duration" value={formatIsoDuration(duration)}></Cell>
        <Cell label="Ascent" value={`${up} meters`}></Cell>
        <Cell label="Descent" value={`${down} meters`}></Cell>
        <Cell label="Highest point" value={`${highestPoint} meters`} />
        <Cell label="Terrain" value={terrain}></Cell>
        <Cell label="Season" value={parseDate(date)} />
        <Cell label="Starting point" value={startingPoint} />
        <Cell label="Ending point" value={endingPoint} />
        <Cell label="Difficulty">
          {difficulty}
          <Link href="/wiki/difficulty" style={{ marginLeft: "8px", color: "inherit" }} title="Difficulty scales explained">
            <FontAwesomeIcon icon={faCircleQuestion} />
          </Link>
        </Cell>
      </tbody>
    </table>
  );
};
