import { AccordionItem } from "components/accordion/AccordionItem";
import { Link } from "components/link/Link";
import React, { FC } from "react";
import styles from "styles/MobileMenuItem.module.css";
import { MobileMenuItemProps } from "./MobileMenuItem.types";

export const MobileMenuItem: FC<MobileMenuItemProps> = ({ href, onClickCallback, name, nestedItems }) => {
  const hasNestedItems = Boolean(nestedItems?.length);

  if (!hasNestedItems) {
    return (
      <li className={styles["menu-item"]} onClick={onClickCallback}>
        <Link href={href} name={name} />
      </li>
    );
  }

  return (
    <AccordionItem
      title={name}
      content={nestedItems?.map(({ name, href }, i) => (
        <li key={i} className={styles["menu-item"]} onClick={onClickCallback}>
          <Link href={href} name={name} />
        </li>
      ))}
    />
  );
};
