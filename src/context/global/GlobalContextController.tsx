import { createContext, PropsWithChildren, useContext, FC, useState } from "react";

export type GlobalContextType = {
  showModal: boolean;
  setOpenModal: (val: boolean) => void;
  currentImage: string;
  setCurrentImage: (val: string) => void;
};

export const GlobalContext = createContext<GlobalContextType | null>(null);

export const GlobalContextController: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [showModal, setOpenModal] = useState(false);
  const [currentImage, setCurrentImage] = useState("");

  return <GlobalContext.Provider value={{ showModal, setOpenModal, currentImage, setCurrentImage }}>{children}</GlobalContext.Provider>;
};
