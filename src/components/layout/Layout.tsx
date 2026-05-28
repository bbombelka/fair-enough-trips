import { FC } from "react";
import styles from "styles/PostLayout.module.css";
import { LayoutProps } from "./Layout.types";

export const Layout: FC<LayoutProps> = ({ children, title, subTitle }) => {
  return (
    <main className="layout">
      {title && <h1 className={styles.title}>{title}</h1>}
      {subTitle && <h2 className={styles.subtitle}>{subTitle}</h2>}
      {children}
    </main>
  );
};
