import clsx from "clsx";
import { checkWindowSize } from "hooks/checkWindowSize";
import React, { FC, useState, useEffect, useRef } from "react";
import styles from "styles/Divider.module.css";
import { useSetDividerTop } from "./useSetDividerTop";

export const Divider: FC<{
  title?: string;
  order?: number;
  stickyScrollToElementId?: string;
}> = ({ title, order = 0, stickyScrollToElementId }) => {
  const [isMounted, setIsMounted] = useState(false);
  const dividerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      process.env.NODE_ENV == "development" &&
      title === stickyScrollToElementId
    ) {
      throw new Error(
        "title and stickyScrollToElementId cannot be identical due to accesibility duplicated id problem"
      );
    }

    setIsMounted(true);
  }, []);

  const { isMobile } = checkWindowSize({ isEnabled: isMounted });
  const style = useSetDividerTop(order, isMobile);

  const scrollIntoView = () => {
    if (stickyScrollToElementId) {
      document
        .getElementById(stickyScrollToElementId)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div
      onClick={isMobile ? scrollIntoView : undefined}
      ref={dividerRef}
      id={title}
      className={clsx(styles.divider, isMobile && styles["sticky-divider"])}
      style={style}
    >
      {title}
    </div>
  );
};
