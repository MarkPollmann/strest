import React, { memo } from "react";

interface IProps {
  style?: any; // StyleProp<View> is breaking here with paddingHorizontal... for some reason
  horizontal?:
    | "flex-end"
    | "flex-start"
    | "center"
    | "space-around"
    | "space-between";
  className?: string;
  wrap?: boolean;
  vertical?: "center" | "flex-start" | "flex-end" | "space-between";
  children?: any;
}

export const Row = memo((props: IProps) => {
  const {
    style = {},
    horizontal = "flex-start",
    vertical = "flex-start",
    wrap,
    children,
    className
  } = props;

  const innerStyle = {
    display: "flex",
    flexDirection: "row",
    justifyContent: horizontal,
    alignItems: vertical,
    flexWrap: wrap ? "wrap" : "nowrap"
  };

  return (
    <div style={{ ...style, ...innerStyle }} className={className}>
      {children}
    </div>
  );
});
