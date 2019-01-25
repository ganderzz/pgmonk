import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, Row, Badge } from "reactstrap";
import { Heading } from "../../../Components/Heading";
import { IPostgresInfo } from "../../../utils/Interfaces/IPostgresInfo";
import { Accordion } from "../../../Components/Accordion";
import { Code } from "../../../Components/Code";

interface IProps {
  queryData: IPostgresInfo;
}

export function QueryCard({ queryData }: IProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div
      style={{
        marginTop: 20,
        marginBottom: 20,
        padding: 20,
        borderRadius: 4,
        borderTop: "2px solid #3483d1",
        boxShadow: "1px 2px 15px rgba(130, 130, 130, 0.3)",
      }}
      key={queryData.Pid}
    >
      <Row>
        <Col xs={6}>
          <Button
            color="primary"
            style={{
              border: 0,
              boxShadow: "1px 2px 8px rgba(130, 130, 130, 0.3)",
              marginRight: 10,
            }}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <FontAwesomeIcon icon="chevron-up" />
            ) : (
              <FontAwesomeIcon icon="chevron-down" />
            )}
          </Button>
          <Badge
            size="sm"
            style={{ position: "relative", bottom: 2 }}
            title="PID"
          >
            {queryData.Pid}
          </Badge>{" "}
          <h4
            style={{
              display: "inline-block",
              marginLeft: 5,
              marginBottom: 0,
            }}
            title="Application Name"
          >
            {queryData.Application_Name ? (
              queryData.Application_Name
            ) : (
              <em>No Application Name</em>
            )}
          </h4>
        </Col>

        <Col xs={6} style={{ textAlign: "right" }}>
          <Badge
            color={queryData.State === "active" ? "success" : "warning"}
            title="Query State"
          >
            {queryData.State}
          </Badge>

          {queryData.Blocked_By &&
            queryData.Blocked_By.filter(Boolean).length > 0 && (
              <Badge color="danger" style={{ marginLeft: 5 }}>
                <FontAwesomeIcon icon="lock" /> Locked By:{" "}
                {queryData.Blocked_By}
              </Badge>
            )}
        </Col>
      </Row>

      <Accordion isOpen={isOpen}>
        <Row style={{ marginTop: 25 }}>
          <Col xs={4}>
            <Heading heading="Database" indicateEmpty>
              {queryData.Datname}
            </Heading>
          </Col>
          <Col xs={4}>
            <Heading heading="User" indicateEmpty>
              {queryData.Usename}
            </Heading>
          </Col>
        </Row>
        <Row style={{ marginTop: 15 }}>
          <Col xs={4}>
            <Heading heading="Client Host" indicateEmpty>
              {queryData.Client_Hostname}
            </Heading>
          </Col>
          <Col xs={4}>
            <Heading heading="Client Address" indicateEmpty>
              {queryData.Client_Addr}
            </Heading>
          </Col>
          <Col xs={4}>
            <Heading heading="Client Port" indicateEmpty>
              {queryData.Client_Port}
            </Heading>
          </Col>
        </Row>

        <Code style={{ marginTop: 25 }}>
          {queryData.Query ? queryData.Query.trim() : "None"}
        </Code>
      </Accordion>
    </div>
  );
}
