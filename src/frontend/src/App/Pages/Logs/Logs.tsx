import * as React from "react";
import { Row, Col, Button } from "reactstrap";
import { HTTP } from "../../utils/API";
import { toast } from "react-toastify";
import { IPostgresLog } from "../../utils/Interfaces/IPostgresLog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LogCard } from "./Components/LogCard";
import { format } from "date-fns";

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

        {info &&
          info.map(log => (
            <React.Fragment key={`${log.date_time}`}>
              <h4
                style={{
                  borderTop: "1px solid #F1F1F1",
                  paddingTop: 10,
                  marginTop: 20,
                }}
              >
                {format(log.date_time, "MM/DD/YYYY")}
              </h4>
              {log.data && log.data.map((p, i) => <LogCard data={p} key={i} />)}
            </React.Fragment>
          ))}
      </Col>
    </Row>
  );
}
