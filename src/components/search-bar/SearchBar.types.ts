import { Dispatch, SetStateAction } from "react";

export type SearchBarProps = {
  setSearchTerm: Dispatch<SetStateAction<string>>;
  isLoading: boolean;
};
