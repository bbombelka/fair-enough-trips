export const useScrollDown = (selector: string) => {
  const scrollDown = () => {
    const navbarMargin = 60;
    const listTitleTopMargin = 20;
    const offsetTop = document.getElementById(selector)?.offsetTop!;
    window.scrollTo(0, offsetTop - navbarMargin - listTitleTopMargin);
  };

  return scrollDown;
};
