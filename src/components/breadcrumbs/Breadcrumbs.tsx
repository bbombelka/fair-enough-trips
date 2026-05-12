import { Link } from "components/link/Link";
import { useBreadcrumbs } from "hooks/useBreadcrumbs";
import React from "react";
import { Categories } from "types/PostPage.types";
import styles from "styles/Breadcrumbs.module.css";

export const Breadcrumbs = ({ category }: { category: Categories }) => {
  const breadCrumbs = useBreadcrumbs(category);

  return (
    <div className={styles.container}>
      {breadCrumbs.map((bc, i) => (
        <>
          <Link href={`/${bc?.url}`} name={bc?.name} key={bc?.url} className={styles.breadcrumb} />
          {i !== breadCrumbs.length - 1 && <span key={`${bc?.url}-separator`}> {">"} </span>}
        </>
      ))}
    </div>
  );
};
