import { FullPost } from "pages/posts/[id]";
import { FC } from "react";
import styles from "styles/TableData.module.css";
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
        <Cell
          isLeft
          label="Attractiveness"
          value={`${attractiveness}/5`}
        ></Cell>
        <Cell label="Condition" value={`${condition}/5`}></Cell>
        <Cell isLeft label="Distance" value={`${distance} km`}></Cell>
        <Cell label="Duration" value={`${duration} h`}></Cell>
        <Cell isLeft label="Ascent" value={`${up} meters`}></Cell>
        <Cell label="Descent" value={`${down} meters`}></Cell>
        <Cell isLeft label="Terrain" value={terrain}></Cell>
        <Cell label="Season" value={parseDate(date)} />
        <Cell isLeft label="Starting point" value={startingPoint} />
        <Cell label="Ending point" value={endingPoint} />
        <Cell isLeft label="Difficulty" value={difficulty} />
        <Cell label="Highest point" value={`${highestPoint} meters`} />
      </div>
    </div>
  );
};
