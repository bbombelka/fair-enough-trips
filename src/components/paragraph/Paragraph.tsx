import React, { FC } from "react";
import styles from "styles/Paragraph.module.css";
import { PostLink } from "types/PostPage.types";

export const Paragraph: FC<{
  body: string[];
  title?: string;
  links?: PostLink[];
  id?: string;
}> = ({ body, title, links, id }) => {
  return (
    <div id={id} className={styles.container}>
      {title && <span className={styles.title}>{title}:</span>}
      {body.map((paragraph, i) => (
        <p key={i} className={styles.paragraph}>
          {paragraph}
        </p>
      ))}
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
