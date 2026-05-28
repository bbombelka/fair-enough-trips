import React, { FC } from "react";
import { BoxProps } from "./Box.types";

export const Box: FC<BoxProps> = ({ children, margin, padding }) => {
  return (
    <div
      style={{
        margin,
        padding,
      }}
    >
      {children}
    </div>
  );
};
