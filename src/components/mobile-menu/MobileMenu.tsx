import { menuLinks } from "app-links";
import { Link } from "components/link/Link";
import React, { useEffect, useState } from "react";
import styles from "styles/MobileMenu.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faBars, faSearch } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { MobileMenuItem } from "./components/MobileMenuItem";

export const MobileMenu = () => {
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    toggleScrollLock(isOpen);
  }, [isOpen]);

  return (
    <>
      <FontAwesomeIcon className={styles["hamburger-icon"]} icon={faBars} size="2x" onClick={() => setOpen(true)} />
      {isOpen && (
        <div className={styles.menu}>
          <div className={styles["menu-bar"]}>
            <Link
              href="/search"
              name={<FontAwesomeIcon className={styles["search-icon"]} icon={faSearch} fontSize={24} onClick={() => setOpen(false)} />}
            ></Link>
            <FontAwesomeIcon className={styles["close-icon"]} icon={faXmark} fontSize={28} onClick={() => setOpen(false)} />
          </div>
          <ul className={styles["menu-list"]}>
            {menuLinks
              .filter(({ name }) => name !== "search") // search link icon is already in the menu heading
              .map(({ name, href, nestedLinks }, i) => (
                <MobileMenuItem key={i} href={href} name={name} nestedItems={nestedLinks} onClickCallback={() => setOpen(false)} />
              ))}
          </ul>
        </div>
      )}
    </>
  );
};

function toggleScrollLock(isOpen: boolean) {
  if (isOpen) {
    document.body.style.height = "100vh";
    document.body.style.overflowY = "hidden";
  } else {
    document.body.style.height = "";
    document.body.style.overflowY = "";
  }
}
