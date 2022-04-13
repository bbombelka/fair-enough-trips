import { TableData } from "components/table-data/TableData";

import { FC } from "react";
import styles from "styles/Map.module.css";
import { FullPost } from "types/PostPage.types";

type MapProps = {
  post: FullPost;
};

export const Map: FC<MapProps> = ({ post }) => {
  return (
    <div className={styles.container}>
      <iframe
        className={styles.map}
        frameBorder="0"
        scrolling="no"
        src={post.iframeUrl}
      />
      <TableData post={post} />
    </div>
  );
};
