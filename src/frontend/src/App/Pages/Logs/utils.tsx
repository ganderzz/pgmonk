import * as React from "react";
import { Badge } from "reactstrap";

export function getStatusColor(status: string) {
  if (!status) {
    return "#007bff";
  }

  switch (status.toLocaleLowerCase()) {
    case "log":
      return "#17a2b8";

    case "error":
      return "#dc3545";

    case "statement":
      return "#343a40";

    default:
      return "#6c757d";
  }
}

export function getStatusFormat(status: string) {
  if (!status) {
    return "";
  }

  switch (status.toLocaleLowerCase()) {
    case "log":
      return <Badge color="info">Log</Badge>;

    case "error":
      return <Badge color="danger">Error</Badge>;

    case "statement":
      return <Badge color="dark">Statement</Badge>;

    default:
      return <Badge color="secondary">{status}</Badge>;
  }
}
