import * as React from "react";

interface IProps {
  isOpen?: boolean;
  children: any;
}

export function Accordion({ isOpen, children }: IProps) {
  if (!isOpen) {
    return null;
  }

  return children;
}
