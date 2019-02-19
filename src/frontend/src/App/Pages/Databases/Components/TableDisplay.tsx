import * as React from "react";
import { ITable } from "../../../utils/Interfaces/ITable";
import { Heading } from "../../../Components/Heading";
import { Row, Col } from "reactstrap";

interface IProps {
  data: ITable;
}

export function TableDisplay({ data }: IProps) {
  if (!data || !data.table_name) {
    return null;
  }

  return (
    <>
      <Row style={{ borderBottom: "1px solid #F1F1F1" }}>
        <Col xs={12}>
          <h4 style={{ fontWeight: 700 }}>
            {data.schema_name}.{data.table_name}
          </h4>
        </Col>
      </Row>

      <Row style={{ marginTop: 30 }}>
        <Col
          xs={4}
          style={
            (data.idx_scan || 0) < (data.seq_scan || 0)
              ? { color: "orange" }
              : {}
          }
        >
          <Heading heading="Index Scans">{data.idx_scan || 0}</Heading>
        </Col>

        <Col xs={4}>
          <Heading heading="Sequential Scans">{data.seq_scan}</Heading>
        </Col>

        <Col xs={4}>
          <Heading heading="Sequential Reads">{data.seq_reads}</Heading>
        </Col>
      </Row>

      <Row style={{ marginTop: 30 }}>
        <Col xs={4}>
          <Heading heading="Inserts">{data.inserts}</Heading>
        </Col>

        <Col xs={4}>
          <Heading heading="Updates">{data.updates}</Heading>
        </Col>

        <Col xs={4}>
          <Heading heading="Deletes">{data.deletes}</Heading>
        </Col>
      </Row>
    </>
  );
}
