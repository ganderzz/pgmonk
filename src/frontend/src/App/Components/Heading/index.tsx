import * as React from "react";

interface IProps {
  heading?: string;
  indicateEmpty?: boolean;
  children?: React.ReactNode | string | number | null;
}

export function Heading({ heading, indicateEmpty = false, children }: IProps) {
  const isEmpty = indicateEmpty && !children;

  return (
    <>
      {heading && (
        <sub
          style={{
            display: "block",
            lineHeight: "1rem",
            opacity: 0.7,
          }}
        >
          {heading}
        </sub>
      )}{" "}
      <h6
        style={{
          fontSize: "1.5rem",
          fontWeight: 400,
          ...(isEmpty ? { fontStyle: "italic" } : {}),
        }}
      >
        {isEmpty ? "n/a" : children}
      </h6>
    </>
  );
}
