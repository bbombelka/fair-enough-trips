import { SVGProps } from "react";

export type AlertProps = {
  message: string;
  className?: string;
} & SVGProps<SVGSVGElement>;
