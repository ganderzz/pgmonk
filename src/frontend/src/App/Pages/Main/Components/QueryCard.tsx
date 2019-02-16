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
      key={queryData.pid}
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
            {queryData.pid}
          </Badge>{" "}
          <h4
            style={{
              display: "inline-block",
              marginLeft: 5,
              marginBottom: 0,
            }}
            title="Application Name"
          >
            {queryData.application_name ? (
              queryData.application_name
            ) : (
              <em>No Application Name</em>
            )}
          </h4>
        </Col>

        <Col xs={6} style={{ textAlign: "right" }}>
          <Badge
            color={queryData.state === "active" ? "success" : "warning"}
            title="Query State"
          >
            {queryData.state}
          </Badge>

          {queryData.blocked_by &&
            queryData.blocked_by.filter(Boolean).length > 0 && (
              <Badge color="danger" style={{ marginLeft: 5 }}>
                <FontAwesomeIcon icon="lock" /> Locked By:{" "}
                {queryData.blocked_by}
              </Badge>
            )}
        </Col>
      </Row>

      <Accordion isOpen={isOpen}>
        <Row style={{ marginTop: 25 }}>
          <Col xs={4}>
            <Heading heading="Database" indicateEmpty>
              {queryData.datname}
            </Heading>
          </Col>
          <Col xs={4}>
            <Heading heading="User" indicateEmpty>
              {queryData.username}
            </Heading>
          </Col>
        </Row>
        <Row style={{ marginTop: 15 }}>
          <Col xs={4}>
            <Heading heading="Client Host" indicateEmpty>
              {queryData.client_hostname}
            </Heading>
          </Col>
          <Col xs={4}>
            <Heading heading="Client Address" indicateEmpty>
              {queryData.client_address}
            </Heading>
          </Col>
          <Col xs={4}>
            <Heading heading="Client Port" indicateEmpty>
              {queryData.client_port}
            </Heading>
          </Col>
        </Row>

        <Code style={{ marginTop: 25 }}>
          {queryData.query ? queryData.query.trim() : "None"}
        </Code>
      </Accordion>
    </div>
  );
}
