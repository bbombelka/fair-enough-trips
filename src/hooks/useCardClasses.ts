import clsx from "clsx";

type UseCardClassesProps = {
  isMainCard: boolean;
  isTop: boolean;
  styles: Record<string, string>;
};

export const useCardClasses = ({ styles, isMainCard, isTop }: UseCardClassesProps) => {
  const textBoxClass = clsx(styles.textBox, isTop ? styles.top : styles.bottom, isMainCard && styles.main);
  const imageClass = clsx(styles["next-image"], isMainCard && styles["next-image-main"], styles["liven-up"]);
  const titleClass = clsx(styles.text, styles[isMainCard ? "title-main" : "title"]);
  const subtitleClass = clsx(styles.text, styles[isMainCard ? "main-post-card-subtitle" : "subtitle"]);
  const scrollDownIconClass = clsx(styles["scroll-down-icon"], isTop && styles["is-top"]);
  const buttonClass = clsx(styles.button, isMainCard && styles.main);
  const imageContainerClass = clsx(styles["next-image-container"], !isMainCard && styles["grid-card"]);
  const containerClass = clsx(styles["container"], isMainCard && styles["container-main-card"]);

  return {
    textBoxClass,
    imageClass,
    titleClass,
    subtitleClass,
    scrollDownIconClass,
    buttonClass,
    imageContainerClass,
    containerClass,
  };
};
