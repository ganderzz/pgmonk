import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Row, Badge, Button } from "reactstrap";
import { Heading } from "../../../Components/Heading";
import { IPostgreLogData } from "../../../utils/Interfaces/IPostgresLog";
import { format } from "date-fns";
import { getStatusFormat, getStatusColor } from "../utils";
import { Accordion } from "../../../Components/Accordion";

interface IProps {
  data: IPostgreLogData;
}

export function LogCard({ data }: IProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div
      style={{
        marginTop: 20,
        marginBottom: 20,
        padding: 20,
        borderRadius: 4,
        borderTop: `2px solid ${getStatusColor(data.status)}`,
        boxShadow: "1px 2px 15px rgba(130, 130, 130, 0.3)",
      }}
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

          {format(data.date_time, "MM/DD/YYYY HH:mm:ssa")}
        </Col>

        <Col xs={6} style={{ textAlign: "right" }}>
          {getStatusFormat(data.status)}
        </Col>
      </Row>

      <Row style={{ marginTop: 20 }}>
        <Col xs={12}>
          <Heading heading="Message" indicateEmpty>
            {data.message ? data.message.trim() : "None"}
          </Heading>
        </Col>
      </Row>

      <Accordion isOpen={isOpen}>
        <Row style={{ marginTop: 20 }}>
          <Col xs={3}>
            <Heading heading="App" indicateEmpty>
              {data.meta.app}
            </Heading>
          </Col>

          <Col xs={3}>
            <Heading heading="Client" indicateEmpty>
              {data.meta.client}
            </Heading>
          </Col>

          <Col xs={3}>
            <Heading heading="DB" indicateEmpty>
              {data.meta.db}
            </Heading>
          </Col>

          <Col xs={3}>
            <Heading heading="User" indicateEmpty>
              {data.meta.user}
            </Heading>
          </Col>
        </Row>
      </Accordion>
    </div>
  );
}
