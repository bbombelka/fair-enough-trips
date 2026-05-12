import { Link } from "components/link/Link";
import { useBreadcrumbs } from "hooks/useBreadcrumbs";
import React from "react";
import { Categories } from "types/PostPage.types";
import styles from "styles/Breadcrumbs.module.css";

export const Breadcrumbs = ({ category, postTitle }: { category: Categories; postTitle: string }) => {
  const breadCrumbs = useBreadcrumbs(category);

  return (
    <div className={styles.container}>
      <Link href="/" name="Home" className={styles.breadcrumb} />
      <span> {">"} </span>
      {breadCrumbs.map((bc, i) => (
        <>
          <Link href={`/${bc?.url}`} name={bc?.name} key={bc?.url} className={styles.breadcrumb} />
          <span key={`${bc?.url}-separator`}> {">"} </span>
        </>
      ))}
      <span>{postTitle}</span>
    </div>
  );
};
