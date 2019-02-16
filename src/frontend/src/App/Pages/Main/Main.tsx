import * as React from "react";
import { Row, Col, Button } from "reactstrap";
import { HTTP } from "../../utils/API";
import { IPostgresInfo } from "../../utils/Interfaces/IPostgresInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { QueryCard } from "./Components/QueryCard";
import { useInterval } from "../../Hooks/useInterval";
import { toast } from "react-toastify";

interface IProps {
  path?: string;
}

export function usePostgresInfoFetcher() {
  const [isLoading, setLoading] = React.useState(false);
  const [info, setInfo] = React.useState<IPostgresInfo[]>([]);

  function getPostgresInfo() {
    setLoading(true);

    return HTTP.getPostgresInfo({ backend_type: "client backend" })
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

export default function Main(props: IProps) {
  const { info, getPostgresInfo, isLoading } = usePostgresInfoFetcher();
  const [isRunningPolling, setPolling] = React.useState(true);
  // Call and load data on initial load
  React.useEffect(() => {
    getPostgresInfo();
  }, []);

  // Refresh page with data after X seconds
  useInterval(
    () => {
      getPostgresInfo().catch(r => {
        setPolling(false);
      });
    },
    isRunningPolling ? 20_000 : null
  );

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

        <h3>Recently Ran Queries</h3>
        {info &&
          info.map(item => <QueryCard key={item.pid} queryData={item} />)}
      </Col>
    </Row>
  );
}
