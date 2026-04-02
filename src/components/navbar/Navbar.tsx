import { navbarLinks } from "app-links";
import { Link } from "components/link/Link";
import { Logo } from "components/icons/Icons";
import { MobileMenu } from "components/mobile-menu/MobileMenu";
import NextLink from "next/link";
import styles from "styles/Navbar.module.css";
import { useRouter } from "next/router";
import { Tab } from "components/tab/Tab";
import clsx from "clsx";

export const Navbar = () => {
  const { asPath } = useRouter();

  return (
    <nav className={styles.navbar}>
      <div className={styles["container-desktop"]}>
        <NextLink href="/">
          <div className={styles["logo-container"]}>
            <Logo width={130} height={45} className={styles.logo} />
          </div>
        </NextLink>
        {navbarLinks.map(({ name, href, nestedLinks }, i, links) => {
          const lastLinkClassname = i === links.length - 1 ? styles["navbar-link-last"] : "";
          const activeLinkClassname = asPath.includes(href) ? styles["navbar-link-active"] : "";
          const linkClassname = clsx(styles["navbar-link"], lastLinkClassname, activeLinkClassname);

          return nestedLinks ? (
            <Tab key={i} name={name}>
              {nestedLinks.map(({ name, href }, i) => (
                <Link className={`${styles["navbar-link"]} ${asPath.includes(href) ? styles["navbar-link-active"] : ""}`} key={i} href={href} name={name} />
              ))}
            </Tab>
          ) : (
            <Link className={linkClassname} key={i} href={href} name={name} />
          );
        })}
      </div>
      <div className={styles["container-mobile"]}>
        <MobileMenu />
      </div>
    </nav>
  );
};
