import { ReactNode, SVGProps } from "react";

export type AlertProps = {
  message: string;
  className?: string;
  children?: ReactNode;
} & SVGProps<SVGSVGElement>;
