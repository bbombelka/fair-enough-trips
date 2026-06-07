"use client";

import { Link } from "components/link/Link";
import { useGlobalContext } from "hooks/useGlobalContext";
import React, { FC, ReactNode } from "react";
import styles from "styles/Paragraph.module.css";
import { ParagraphProps } from "./Paragraph.types";

export const Paragraph: FC<ParagraphProps> = ({ body, title, links, id }) => {
  const content: ReactNode[] = [];
  let listItems: ReactNode[] = [];
  let listTag: "ul" | "ol" = "ul";
  const { setOpenModal, setCurrentImage } = useGlobalContext();
  const getListTagClassname = (tag: string) => (tag === "ul" ? styles["list-unordered"] : "");

  body.forEach((paragraph, i) => {
    if (typeof paragraph === "object" && paragraph.tag.startsWith("li")) {
      if (listItems.length === 0) {
        listTag = paragraph.tag === "li-ol" ? "ol" : "ul";
      }
      listItems.push(
        <li key={`li-${i}`} className={styles["list-item"]}>
          {paragraph.body}
        </li>,
      );
    } else {
      if (listItems.length > 0) {
        const ListWrapper = listTag;
        content.push(
          <ListWrapper key={`${listTag}-${i}`} className={`${styles.list} ${getListTagClassname(listTag)}`}>
            {listItems}
          </ListWrapper>,
        );
        listItems = [];
      }
      if (typeof paragraph === "string") {
        content.push(
          <p id={`${id}-paragraph-${i + 1}`} key={i} className={styles.paragraph}>
            {paragraph}
          </p>,
        );
      }
    }
  });

  if (listItems.length > 0) {
    const ListWrapper = listTag;
    content.push(
      <ListWrapper key={`${listTag}-last`} className={`${styles.list} ${getListTagClassname(listTag)}`}>
        {listItems}
      </ListWrapper>,
    );
  }

  return (
    <div id={id} className={styles.container}>
      {title && <h3 className={styles.title}>{title}:</h3>}
      {content}
      {Boolean(links?.length) && (
        <p>
          <span className={styles.links}>Links:</span>
          {links?.map(({ title, href, internal, type }, id) => {
            if (internal) {
              switch (type) {
                case "navigation":
                  return <Link key={id} className={styles.link} href={href} name={title} />;
                case "image":
                  return (
                    <a
                      key={id}
                      className={styles.link}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentImage(href);
                        setOpenModal(true);
                      }}
                    >
                      <span style={{ cursor: "pointer" }}>{title}</span>
                    </a>
                  );
                default:
                  return (
                    <a key={id} href={`#${href}`}>
                      {title}
                    </a>
                  );
              }
            } else {
              return (
                <a key={id} className={styles.link} href={href} target="_blank">
                  <span>{title}</span>
                </a>
              );
            }
          })}
        </p>
      )}
    </div>
  );
};
