import { navbarLinks } from "app-links";
import { Link } from "components/link/Link";
import { MobileMenu } from "components/mobile-menu/MobileMenu";
import NextLink from "next/link";
import React from "react";
import styles from "styles/Navbar.module.css";

export const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles["container-desktop"]}>
        <NextLink href="/">
          <a>
            <div
              style={{
                width: "48px",
                height: "48px",
                backgroundColor: "black",
              }}
            >
              Logo
            </div>
          </a>
        </NextLink>
        {navbarLinks.map(({ name, href }, i) => (
          <Link key={i} href={href} name={name} leftMargin={24} />
        ))}
      </div>
      <div className={styles["container-mobile"]}>
        <MobileMenu />
      </div>
    </nav>
  );
};
