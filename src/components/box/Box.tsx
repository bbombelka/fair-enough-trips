import React, { FC } from "react";

type BoxProps = {
  margin?: string;
  padding?: string;
};

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
