import { GlobalContext } from "context/global/GlobalContextController";
import { useContext } from "react";

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalContextController");
  }
  return context;
};
