import * as React from "react";
import { Row, Col, Button, Badge } from "reactstrap";
import { HTTP } from "../../utils/API";
import { IPostgresInfo } from "../../utils/Interfaces/IPostgresInfo";
import { Code } from "../../Components/Code";
import { Heading } from "../../Components/Heading";

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
          style={{ marginTop: 10 }}
          disabled={isLoading}
        >
          {isLoading ? "Refreshing..." : "Refresh"}
        </Button>

        {info &&
          info.map(item => (
            <div
              style={{
                marginTop: 20,
                marginBottom: 20,
                padding: 20,
                borderRadius: 4,
                borderTop: "2px solid #3483d1",
                boxShadow: "1px 2px 15px rgba(130, 130, 130, 0.3)",
              }}
              key={item.Pid}
            >
              <Row>
                <Col xs={6}>
                  <Badge
                    size="sm"
                    style={{ position: "relative", bottom: 4 }}
                    title="PID"
                  >
                    {item.Pid}
                  </Badge>{" "}
                  <h4
                    style={{
                      display: "inline-block",
                      marginLeft: 5,
                      marginBottom: 0,
                    }}
                    title="Application Name"
                  >
                    {item.Application_Name ? (
                      item.Application_Name
                    ) : (
                      <em>No Application Name</em>
                    )}
                  </h4>
                </Col>

                <Col xs={6} style={{ textAlign: "right" }}>
                  <Badge
                    color={item.State === "active" ? "success" : "warning"}
                    title="Query State"
                  >
                    {item.State}
                  </Badge>
                </Col>
              </Row>
              <Row style={{ marginTop: 25 }}>
                <Col xs={4}>
                  <Heading heading="Database" indicateEmpty>
                    {item.Datname}
                  </Heading>
                </Col>
                <Col xs={4}>
                  <Heading heading="User" indicateEmpty>
                    {item.Usename}
                  </Heading>
                </Col>
              </Row>
              <Row style={{ marginTop: 15 }}>
                <Col xs={4}>
                  <Heading heading="Client Host" indicateEmpty>
                    {item.Client_Hostname}
                  </Heading>
                </Col>
                <Col xs={4}>
                  <Heading heading="Client Address" indicateEmpty>
                    {item.Client_Addr}
                  </Heading>
                </Col>
                <Col xs={4}>
                  <Heading heading="Client Port" indicateEmpty>
                    {item.Client_Port}
                  </Heading>
                </Col>
              </Row>

              <Code style={{ marginTop: 25 }}>{item.Query}</Code>
            </div>
          ))}
      </Col>
    </Row>
  );
}
