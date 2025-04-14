import React, { PropsWithChildren, FC } from "react";
import styles from "styles/GraphTooltip.module.css";

type GraphTooltipProps = {
  left: number;
  top: number;
};

export const GraphTooltip: FC<PropsWithChildren<GraphTooltipProps>> = ({ children, left, top }) => {
  return (
    <div
      className={styles["tooltip"]}
      style={{
        left: `${left}px`,
        top: `${top}px`,
      }}
    >
      {children}
    </div>
  );
};
