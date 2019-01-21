import * as React from "react";

interface IProps {
  format?: boolean;
  children: React.ReactNode;
  style?: {};
}

export function Code({ format = true, style = {}, children }: IProps) {
  if (!children) {
    return null;
  }

  const codeElem = <code>{children}</code>;

  if (format) {
    return (
      <pre
        style={{
          padding: 15,
          borderRadius: 4,
          background: "#F1F1F1",
          color: "#A10022",
          ...style,
        }}
      >
        {codeElem}
      </pre>
    );
  }

  return codeElem;
}
