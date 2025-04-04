import { menuLinks } from "app-links";
import { Link } from "components/link/Link";
import React, { useEffect, useState } from "react";
import styles from "styles/MobileMenu.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faBars } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";

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
            <FontAwesomeIcon className={styles["close-icon"]} icon={faXmark} size="2x" onClick={() => setOpen(false)} />
          </div>
          <ul className={styles["menu-list"]}>
            {menuLinks.map(({ name, href }, i) => (
              <li key={i} className={styles["menu-item"]} onClick={() => setOpen(false)}>
                <Link href={href} name={name} />
              </li>
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
