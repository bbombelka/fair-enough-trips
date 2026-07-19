import React, { FC } from "react";
import { Divider } from "components/divider/Divider";
import { Paragraph } from "components/paragraph/Paragraph";
import styles from "styles/GearProsCons.module.css";

export interface GearProsConsProps {
  brand: string;
  name: string;
  pros: string[];
  cons: string[];
  order: number;
}

export const GearProsCons: FC<GearProsConsProps> = ({ brand, name, pros, cons, order }) => {
  if ((pros?.length ?? 0) === 0 && (cons?.length ?? 0) === 0) return null;

  return (
    <>
      <Divider title={`${brand} ${name} - Pros & Cons`} order={order} stickyScrollToElementId="gear-pros-cons" />
      <div id="gear-pros-cons" className={styles.container}>
        {pros.length && (
          <div className={styles.column}>
            <Paragraph title="Pros" body={pros!.map((pro: string) => ({ tag: "li", body: pro }))} />
          </div>
        )}
        {cons.length && (
          <div className={styles.column}>
            <Paragraph title="Cons" body={cons!.map((con: string) => ({ tag: "li", body: con }))} />
          </div>
        )}
      </div>
    </>
  );
};
