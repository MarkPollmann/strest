import React from "react";

interface IProps {
  children: any;
}

export function Card(props: IProps) {
  return (
    <div className="border border-width-1 rounded-lg min-h-32 w-full p-2 m-2">
      {props.children}
    </div>
  );
}
