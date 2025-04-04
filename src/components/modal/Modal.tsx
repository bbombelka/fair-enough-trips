import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { AllHTMLAttributes, PropsWithChildren, useEffect } from "react";
import styles from "styles/Modal.module.css";
import layoutStyles from "styles/PostLayout.module.css";

interface ModalProps extends AllHTMLAttributes<HTMLDivElement> {
  closeModalCallback: () => void;
  title?: string;
}

export const Modal = ({ className, closeModalCallback, children, title, ...props }: PropsWithChildren<ModalProps>) => {
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
        {title && <h1 className={layoutStyles.title}>{title}</h1>}
        <FontAwesomeIcon className={styles["close-icon"]} icon={faXmark} size="3x" onClick={closeModalCallback} />
      </div>
      <div className={styles["modal-content"]}>{children}</div>
    </div>
  );
};
