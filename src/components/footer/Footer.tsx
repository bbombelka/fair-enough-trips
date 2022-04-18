import { footerLinks } from "app-links";
import clsx from "clsx";
import { Link } from "components/link/Link";
import React, { FC } from "react";
import styles from "styles/Footer.module.css";

type FooterProps = {
  isSticky?: boolean;
};

export const Footer: FC<FooterProps> = ({ isSticky }) => {
  const footerClassName = clsx(styles.footer, isSticky && styles.sticky);

  return (
    <footer className={footerClassName}>
      {footerLinks.map(({ name, href }, i) => (
        <Link key={i} href={href} name={name} leftMargin={48} />
      ))}
    </footer>
  );
};
