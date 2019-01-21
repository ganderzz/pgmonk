import * as React from "react";

interface IProps {
  heading?: string;
  indicateEmpty?: boolean;
  children: React.ReactNode;
}

export function Heading({ heading, indicateEmpty = false, children }: IProps) {
  const isEmpty = indicateEmpty && !children;

  return (
    <>
      {heading && (
        <sub
          style={{
            display: "block",
            color: "#888",
            lineHeight: "1rem",
          }}
        >
          {heading}
        </sub>
      )}{" "}
      <h6
        style={{
          fontSize: "1.2rem",
          fontWeight: 400,
          ...(isEmpty ? { fontStyle: "italic" } : {}),
        }}
      >
        {isEmpty ? "n/a" : children}
      </h6>
    </>
  );
}
