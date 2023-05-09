import { StarRate } from "components/star-rate/StarRate";
import { useCountUpAnimation } from "hooks/useCountUpAnimation";
import { FC } from "react";
import styles from "styles/TableData.module.css";
import { FullPost } from "types/PostPage.types";
import { parseDate } from "utils";
import { Cell } from "./components/Cell";

type TableDataProps = {
  post: FullPost;
};

export const TableData: FC<TableDataProps> = ({
  post: {
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
    <div className={styles.container}>
      <div className={styles.table}>
        <Cell label="Attractiveness">
          <a href="/about#rating">
            <StarRate rate={attractiveness} />
          </a>
        </Cell>
        <Cell label="Condition">
          <a href="/about#rating">
            <StarRate rate={condition} />
          </a>
        </Cell>
        <Cell label="Distance" value={`${useCountUpAnimation({animatedValue: distance })} km`}></Cell>
        <Cell label="Duration" value={`${duration} h`}></Cell>
        <Cell label="Ascent" value={`${useCountUpAnimation({animatedValue: up, delay: 500})} meters`}></Cell>
        <Cell label="Descent" value={`${useCountUpAnimation({animatedValue: down, delay: 1000})} meters`}></Cell>
        <Cell label="Highest point" value={`${useCountUpAnimation({animatedValue: highestPoint, delay: 1500})} meters`} />
        <Cell label="Terrain" value={terrain}></Cell>
        <Cell label="Season" value={parseDate(date)} />
        <Cell label="Starting point" value={startingPoint} />
        <Cell label="Ending point" value={endingPoint} />
        <Cell label="Difficulty" value={difficulty} />
      </div>
    </div>
  );
};
