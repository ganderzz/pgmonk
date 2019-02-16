import * as React from "react";
import { Row, Col, Table, Button, Badge } from "reactstrap";
import { HTTP } from "../../utils/API";
import { toast } from "react-toastify";
import { IPostgresLog } from "../../utils/Interfaces/IPostgresLog";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface IProps {
  path?: string;
}

export function usePostgresLogsFetcher() {
  const [isLoading, setLoading] = React.useState(false);
  const [info, setInfo] = React.useState<IPostgresLog[]>([]);

  function getPostgresInfo() {
    setLoading(true);

    return HTTP.getPostgresLogs()
      .then(pgInfo => {
        setInfo(pgInfo);
        setLoading(false);
      })
      .catch(response => {
        setLoading(false);
        toast.error(`${response}`);

        return Promise.reject();
      });
  }

  return {
    info,
    getPostgresInfo,
    isLoading,
  };
}

function getStatusFormat(status: string) {
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

export default function Logs({  }: IProps) {
  const { info, getPostgresInfo, isLoading } = usePostgresLogsFetcher();

  React.useEffect(() => {
    getPostgresInfo();
  }, []);

  return (
    <Row>
      <Col xs={12}>
        <Button
          onClick={getPostgresInfo}
          style={{ marginTop: 10, marginBottom: 30 }}
          disabled={isLoading}
        >
          <FontAwesomeIcon icon="sync" spin={isLoading} />{" "}
          {isLoading ? "Refreshing..." : "Refresh"}
        </Button>

        <h3>Logs</h3>

        <Table striped>
          <thead>
            <tr>
              <th>Status</th>
              <th style={{ width: "20%" }}>Date</th>
              <th>App</th>
              <th>User</th>
              <th>DB</th>
              <th>Client</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {info &&
              info.map((item, i) => (
                <tr key={i}>
                  <td>{getStatusFormat(item.Status)}</td>
                  <td>{format(item.DateTime, "MM/DD/YYYY HH:mm:ssa")}</td>
                  <td>{item.Meta.App}</td>
                  <td>{item.Meta.User}</td>
                  <td>{item.Meta.DB}</td>
                  <td>{item.Meta.Client}</td>
                  <td>{item.Message}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Col>
    </Row>
  );
}
