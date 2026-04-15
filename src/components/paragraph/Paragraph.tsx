import React, { FC, ReactNode } from "react";
import styles from "styles/Paragraph.module.css";
import { PostLink } from "types/PostPage.types";

type ParapgraphHTMLElement = {
  tag: "li" | "ul" | "ol";
  body: string;
};

export const Paragraph: FC<{
  body: Array<string | ParapgraphHTMLElement>;
  title?: string;
  links?: PostLink[];
  id?: string;
}> = ({ body, title, links, id }) => {
  const content: ReactNode[] = [];
  let listItems: ReactNode[] = [];

  body.forEach((paragraph, i) => {
    if (typeof paragraph === "object" && paragraph.tag === "li") {
      listItems.push(
        <li key={`li-${i}`} className={styles["list-item"]}>
          {paragraph.body}
        </li>,
      );
    } else {
      if (listItems.length > 0) {
        content.push(
          <ul key={`ul-${i}`} className={styles.list}>
            {listItems}
          </ul>,
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
    content.push(<ul key="ul-last">{listItems}</ul>);
  }

  return (
    <div id={id} className={styles.container}>
      {title && <h3 className={styles.title}>{title}:</h3>}
      {content}
      {Boolean(links?.length) && (
        <p>
          <span className={styles.links}>Links:</span>
          {links?.map(({ title, href }, id) => (
            <a key={id} className={styles.link} href={href} target="_blank">
              <span>{title}</span>
            </a>
          ))}
        </p>
      )}
    </div>
  );
};
