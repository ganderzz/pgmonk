import * as React from "react";
import { Row, Col, Button } from "reactstrap";
import { HTTP } from "../../utils/API";
import { IPostgresInfo } from "../../utils/Interfaces/IPostgresInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { QueryCard } from "./Components/QueryCard";

interface IProps {
  path?: string;
}

export function useUsers() {
  const [isLoading, setLoading] = React.useState(false);
  const [info, setInfo] = React.useState<IPostgresInfo[]>([]);

  function getPostgresInfo() {
    setLoading(true);

    HTTP.getPostgresInfo().then(pgInfo => {
      setInfo(pgInfo);
      setLoading(false);
    });
  }

  React.useEffect(() => {
    getPostgresInfo();

    const id = setInterval(() => {
      getPostgresInfo();
    }, 20000);

    return () => clearInterval(id);
  }, []);

  return {
    info,
    getPostgresInfo,
    isLoading,
  };
}

export default function Main(props: IProps) {
  const { info, getPostgresInfo, isLoading } = useUsers();

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

        <h3>Active Queries</h3>
        {info &&
          info.map(item => <QueryCard key={item.Pid} queryData={item} />)}
      </Col>
    </Row>
  );
}
