import * as React from "react";
import { Accordion } from "../Accordion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface IProps {
  header: string;
  children: { [key: string]: any }[];
  style?: {};
  open?: boolean;
  activeItem?: string;
  onItemClick: (name: string) => void;
}

function parseChildren(
  children: any[],
  activeItem: string,
  onItemClick: (name: string) => void
) {
  if (!children || (Array.isArray(children) && children.length === 0)) {
    return <em>Empty</em>;
  }

  if (typeof children === "object" && !Array.isArray(children)) {
    return Object.keys(children).map(key => {
      const activeTableInCatagory =
        Array.isArray(children[key]) &&
        (children[key] as any).filter(p => p === activeItem);

      return (
        <Tree
          key={key}
          header={key}
          open={activeTableInCatagory.length > 0}
          activeItem={activeItem}
          onItemClick={onItemClick}
        >
          {children[key]}
        </Tree>
      );
    });
  }

  if (Array.isArray(children)) {
    return children.map(item => (
      <a
        key={item}
        style={{ display: "block", cursor: "pointer" }}
        onClick={() => onItemClick(item)}
      >
        {item}
      </a>
    ));
  }

  return children;
}

export function Tree({
  header,
  children,
  style = {},
  open = false,
  activeItem = "",
  onItemClick,
}: IProps) {
  const [isOpen, setOpen] = React.useState(open);

  React.useEffect(() => {
    setOpen(open);
  }, [open]);

  return (
    <div style={style}>
      <strong
        style={{
          cursor: "pointer",
          ...(isOpen ? { color: "blue" } : {}),
        }}
        onClick={() => setOpen(!isOpen)}
      >
        {children && (
          <>
            {isOpen ? (
              <FontAwesomeIcon icon="chevron-down" />
            ) : (
              <FontAwesomeIcon icon="chevron-right" />
            )}{" "}
          </>
        )}
        {header}
      </strong>

      <Accordion isOpen={isOpen}>
        <div style={{ marginLeft: 20, marginTop: 5 }}>
          {parseChildren(children, activeItem, onItemClick)}
        </div>
      </Accordion>
    </div>
  );
}
