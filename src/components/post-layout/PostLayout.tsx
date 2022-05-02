import { FC } from "react";
import styles from "styles/PostLayout.module.css";

type PostLayoutProps = {
  title: string;
};

export const PostLayout: FC<PostLayoutProps> = ({ children, title }) => {
  return (
    <div className="layout">
      <h1 className={styles.title}>{title}</h1>
      {children}
    </div>
  );
};
