import { Link } from "components/link/Link";
import { useBreadcrumbs } from "hooks/useBreadcrumbs";
import React from "react";
import styles from "styles/Breadcrumbs.module.css";
import { BreadcrumbsProps } from "./Breadcrumbs.types";

export const Breadcrumbs = ({ category, postTitle, parentData }: BreadcrumbsProps) => {
  const breadCrumbs = useBreadcrumbs(category);

  return (
    <div className={styles.container}>
      <Link href="/" name="Home" className={styles.breadcrumb} />
      <span> {">"} </span>
      {breadCrumbs.map((bc, i) => (
        <span key={i}>
          <Link href={`/${bc?.url}`} name={bc?.name} key={bc?.url} className={styles.breadcrumb} />
          <span key={`${bc?.url}-separator`}> {">"} </span>
        </span>
      ))}
      {parentData && (
        <>
          <Link href={parentData.id} name={parentData?.title} className={styles.breadcrumb} />
          <span> {">"} </span>
        </>
      )}
      <span>{postTitle}</span>
    </div>
  );
};
