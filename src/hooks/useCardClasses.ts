import clsx from "clsx";

type UseCardClassesProps = {
  isMainCard: boolean;
  isTop: boolean;
  styles: Record<string, string>;
  isAnimationTriggered: boolean;
};

export const useCardClasses = ({
  styles,
  isMainCard,
  isTop,
  isAnimationTriggered,
}: UseCardClassesProps) => {
  const textBoxClass = clsx(
    styles.textBox,
    isTop ? styles.top : styles.bottom,
    isMainCard && styles.main,
  );

  const imageClass = clsx(
    styles.image,
    styles[isMainCard ? "main-post-card" : "grid-card"],
    isAnimationTriggered && styles["liven-up"],
  );

  const titleClass = clsx(
    styles.text,
    styles[isMainCard ? "title-main" : "title"],
  );

  const subtitleClass = clsx(
    styles.text,
    styles[isMainCard ? "main-post-card-subtitle" : "subtitle"],
  );

  const scrollDownIconClass = clsx(
    styles["scroll-down-icon"],
    isTop && styles["is-top"],
  );

  const buttonClass = clsx(styles.button, isMainCard && styles.main);

  return {
    textBoxClass,
    imageClass,
    titleClass,
    subtitleClass,
    scrollDownIconClass,
    buttonClass,
  };
};
