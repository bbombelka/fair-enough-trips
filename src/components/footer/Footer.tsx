import { footerLinks } from "app-links";
import { Link } from "components/link/Link";
import React from "react";
import styles from "styles/Footer.module.css";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      {footerLinks.map(({ name, href }, i) => (
        <Link key={i} href={href} name={name} leftMargin={24} />
      ))}
    </footer>
  );
};
