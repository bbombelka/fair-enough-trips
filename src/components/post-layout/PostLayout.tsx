import { FC } from "react";
import styles from "styles/PostLayout.module.css";

export const PostLayout: FC = ({ children }) => {
  return <div className={styles.layout}>{children}</div>;
};
