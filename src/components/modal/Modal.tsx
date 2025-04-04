import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { PropsWithChildren, useEffect } from "react";
import styles from "styles/Modal.module.css";
import layoutStyles from "styles/PostLayout.module.css";

type ModalProps = {
  closeModalCallback: () => void;
  title?: string;
};

export const Modal = ({ closeModalCallback, children, title }: PropsWithChildren<ModalProps>) => {
  useEffect(() => {
    document.body.style.height = "100vh";
    document.body.style.overflowY = "hidden";

    return () => {
      document.body.style.height = "";
      document.body.style.overflowY = "";
    };
  }, []);

  return (
    <div className={styles["modal-container"]} role="dialog">
      <div className={styles["modal-header"]}>
        {title && <h1 className={layoutStyles.title}>{title}</h1>}
        <FontAwesomeIcon className={styles["close-icon"]} icon={faXmark} size="3x" onClick={closeModalCallback} />
      </div>
      <div className={styles["modal-content"]}>{children}</div>
    </div>
  );
};
