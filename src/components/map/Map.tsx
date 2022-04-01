import { TableData } from "components/table-data/TableData";
import { FullPost } from "pages/posts/[id]";
import { FC } from "react";
import styles from "styles/Map.module.css";

type MapProps = {
  post: FullPost;
};

export const Map: FC<MapProps> = ({ post }) => {
  return (
    <div className={styles.container}>
      <iframe
        frameBorder="0"
        scrolling="no"
        src={post.wikilocUrl}
        width="66%"
        height="400"
      />
      <TableData post={post} />
    </div>
  );
};
