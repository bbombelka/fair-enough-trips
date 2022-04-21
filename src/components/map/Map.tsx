import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "components/link/Link";
import { TableData } from "components/table-data/TableData";
import Config from "Config";
import { FC } from "react";
import styles from "styles/Map.module.css";
import { FullPost } from "types/PostPage.types";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

type MapProps = {
  post: FullPost;
};

export const Map: FC<MapProps> = ({ post }) => {
  return (
    <>
      <div className={styles.container}>
        <iframe
          className={styles.map}
          frameBorder="0"
          scrolling="no"
          src={post.iframeUrl}
        />
        <TableData post={post} />
      </div>
      <a
        className={styles.link}
        href={`/${post.id}/track.${Config.COMPRESSED_FILE_EXTENSION}`}
      >
        <FontAwesomeIcon icon={faDownload} className={styles.icon} />
        <span>Download gps track</span>
      </a>
    </>
  );
};
