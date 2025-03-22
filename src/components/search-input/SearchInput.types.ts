import { Dispatch, SetStateAction } from "react";

export type SearchInputProps = {
  setSearchTerm: Dispatch<SetStateAction<string>>;
  isLoading: boolean;
};
