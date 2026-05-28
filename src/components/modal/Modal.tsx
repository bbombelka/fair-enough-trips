import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { PropsWithChildren, useEffect } from "react";
import styles from "styles/Modal.module.css";
import layoutStyles from "styles/PostLayout.module.css";
import { isMobileDevice } from "utils";
import { ModalProps } from "./Modal.types";

export const Modal = ({ className, closeModalCallback, children, title, ...props }: PropsWithChildren<ModalProps>) => {
  const isMobileUA = isMobileDevice();

  useEffect(() => {
    document.body.style.height = "100vh";
    document.body.style.overflowY = "hidden";

    return () => {
      document.body.style.height = "";
      document.body.style.overflowY = "";
    };
  }, []);

  return (
    <div className={`${styles["modal-container"]} ${className}`} role="dialog" {...props}>
      <div className={styles["modal-header"]}>
        {!isMobileUA && title && <h1 className={layoutStyles.title}>{title}</h1>}
        <FontAwesomeIcon className={styles["close-icon"]} icon={faXmark} size={isMobileUA ? "1x" : "3x"} onClick={closeModalCallback} />
      </div>
      <div className={styles["modal-content"]}>{children}</div>
    </div>
  );
};
