import * as React from "react";
import { Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFetcher } from "../../Hooks/useFetcher";

interface IProps {
  format?: boolean;
  children: React.ReactNode;
  style?: {};
}

export function Code({ format = true, style = {}, children }: IProps) {
  if (!children) {
    return null;
  }

  const [data, fetchAnalyzeData, _, setData] = useFetcher((HTTP, args) => {
    return HTTP.analyzeQuery(args ? args[0] : "");
  });

  const codeElem = <code>{children}</code>;

  if (format) {
    return (
      <>
        <pre
          style={{
            padding: 15,
            borderRadius: 4,
            background: "#F1F1F1",
            color: "#A10022",
            position: "relative",
            ...style,
          }}
        >
          <Button
            color="dark"
            size="sm"
            style={{
              fontFamily: `-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"`,
              position: "absolute",
              top: 0,
              right: 0,
            }}
            onClick={() =>
              fetchAnalyzeData(children.toString()).catch(error => {
                setData([error.message]);
              })
            }
          >
            <FontAwesomeIcon icon="info-circle" /> Explain
          </Button>
          {codeElem}
        </pre>

        {data && (
          <pre
            style={{
              padding: 15,
              borderRadius: 4,
              background: "#F1F1F1",
              color: "#A10022",
              position: "relative",
              ...style,
            }}
          >
            <Button
              color="dark"
              size="sm"
              style={{
                fontFamily: `-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"`,
                position: "sticky",
                left: "calc(100% - 50px)",
                top: "calc(100% - 25px)",
              }}
              onClick={() => setData(null)}
            >
              <FontAwesomeIcon icon="minus" /> Hide
            </Button>
            <code>{data.join("\n")}</code>
          </pre>
        )}
      </>
    );
  }

  return codeElem;
}
