import clsx from "clsx";

import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styles from "styles/JumpToTopButton.module.css";
import { useHasHash } from "hooks/useHasHash";
import { JumpToTopButtonProps } from "./JumpToTopButton.types";

export function JumpToTopButton<T extends HTMLElement>({ element }: JumpToTopButtonProps<T>) {
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  const hash = useHasHash();

  useEffect(() => {
    if (hash) {
      setVisible(true);
    }
  }, [hash]);

  const scrollToTop = () => {
    if (window.location.hash) {
      setVisible(false);
      router.back();
    }

    element?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <button onClick={scrollToTop} className={clsx(styles["jump-to-top-button"], visible && styles["visible"])} aria-label="Back to top">
      ↑
    </button>
  );
}
