import { FC } from "react";
import styles from "styles/PostLayout.module.css";

type LayoutProps = {
  title?: string;
};

export const Layout: FC<LayoutProps> = ({ children, title }) => {
  return (
    <main className="layout">
      {title && <h1 className={styles.title}>{title}</h1>}
      {children}
    </main>
  );
};
