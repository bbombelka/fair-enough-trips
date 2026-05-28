import { ReactNode } from "react";

export type CellProps = {
  label: string;
  value?: string | number;
  children?: ReactNode;
};
