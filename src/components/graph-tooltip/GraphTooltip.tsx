import useClickAway from "hooks/useClickAway";
import React, { PropsWithChildren, FC, useRef } from "react";
import styles from "styles/GraphTooltip.module.css";

type GraphTooltipProps = {
  left: number;
  top: number;
  onClickAway?: () => void;
};

export const GraphTooltip: FC<PropsWithChildren<GraphTooltipProps>> = ({ children, left, top, onClickAway }) => {
  const tooltipRef = useRef<HTMLDivElement>(null);

  useClickAway(tooltipRef, onClickAway);

  return (
    <div
      ref={tooltipRef}
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
