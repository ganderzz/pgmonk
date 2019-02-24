import * as React from "react";
import { Row, Col, Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { QueryCard } from "./Components/QueryCard";
import { useInterval } from "../../Hooks/useInterval";
import { usePostgresInfoFetcher } from "../../Hooks/usePostgresInfoFetcher";
import { useStatsStatementFetcher } from "../../Hooks/useStatsStatementFetcher";
import { Code } from "../../Components/Code";
import { Accordion } from "../../Components/Accordion";
import { Heading } from "../../Components/Heading";

interface IProps {
  path?: string;
}

export default function Main(props: IProps) {
  const [info, getPostgresInfo, isLoading] = usePostgresInfoFetcher();
  const [stats, getStats] = useStatsStatementFetcher();
  const [isRunningPolling, setPolling] = React.useState(true);
  const [isRecentQueriesShowing, setRecentQueriesShowing] = React.useState(
    false
  );

  // Call and load data on initial load
  React.useEffect(() => {
    getPostgresInfo();
    getStats();
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
    <>
      <Row>
        <Col xs={12}>
          <Button
            onClick={getPostgresInfo}
            style={{ marginTop: 10 }}
            disabled={isLoading}
          >
            <FontAwesomeIcon icon="sync" spin={isLoading} /> Refresh
          </Button>
        </Col>
      </Row>

      <Row style={{ marginTop: 20 }}>
        <Col xs={12}>
          <h3>Active Connections</h3>
          {info &&
            info.map((item, i) => <QueryCard key={i} queryData={item} />)}
        </Col>
      </Row>

      <Row style={{ marginTop: 40 }}>
        <Col xs={12}>
          <Button
            onClick={() => setRecentQueriesShowing(!isRecentQueriesShowing)}
          >
            {isRecentQueriesShowing
              ? "Close Query Execution"
              : "Show Query Execution"}
          </Button>

          <div>
            <Accordion isOpen={isRecentQueriesShowing}>
              {stats &&
                stats.map((item, i) => (
                  <Row
                    key={i}
                    style={{
                      padding: 20,
                      marginTop: 10,
                      marginRight: 10,
                      marginLeft: 10,
                      boxShadow: "rgba(130, 130, 130, 0.3) 1px 2px 15px",
                    }}
                  >
                    <Col xs={6}>
                      <Heading heading="Database">{item.database_name}</Heading>
                    </Col>
                    <Col xs={6}>
                      <Heading heading="Average Time">
                        {item.average_time}ms
                      </Heading>
                    </Col>

                    <Col xs={12}>
                      <Code>{item.query}</Code>
                    </Col>
                  </Row>
                ))}
            </Accordion>
          </div>
        </Col>
      </Row>
    </>
  );
}
