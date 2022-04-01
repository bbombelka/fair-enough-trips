import { linkSync } from "fs";
import { PostLink } from "pages/posts/[id]";
import React, { FC } from "react";
import styles from "styles/Paragraph.module.css";

export const Paragraph: FC<{
  body: string;
  title?: string;
  links?: PostLink[];
}> = ({ body, title, links }) => {
  return (
    <div className={styles.container}>
      {title && <span className={styles.title}>{title}:</span>}
      <p className={styles.paragraph}>{body}</p>
      {links?.length && (
        <p>
          <span className={styles.links}>Links:</span>
          {links.map(({ title, href }, id) => (
            <a key={id} className={styles.link} href={href} target="_blank">
              <span>{title}</span>
            </a>
          ))}
        </p>
      )}
    </div>
  );
};
