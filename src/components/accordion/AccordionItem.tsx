import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { FC, ReactNode, useState } from "react";
import styles from "styles/Accordion.module.css";

type AccordionItemProps = {
  title: string;
  content: ReactNode;
};

export const AccordionItem: FC<AccordionItemProps> = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles["accordion-item"]}>
      <button className={styles["accordion-header"]} onClick={() => setIsOpen(!isOpen)} aria-expanded={isOpen}>
        <span className={styles["accordion-title"]}>{title}</span>
        <span className={styles["accordion-icon"]}>
          <FontAwesomeIcon className={styles["close-icon"]} icon={isOpen ? faChevronUp : faChevronDown} fontSize={16} />
        </span>
      </button>
      {isOpen && <div className={styles["accordion-content"]}>{content}</div>}
    </div>
  );
};
