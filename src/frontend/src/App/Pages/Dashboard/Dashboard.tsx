import * as React from "react";
import { Row, Col, Button } from "reactstrap";
import { HTTP } from "../../utils/API";
import { IPostgresInfo } from "../../utils/Interfaces/IPostgresInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { QueryCard } from "./Components/QueryCard";
import { useInterval } from "../../Hooks/useInterval";
import { toast } from "react-toastify";
import {
  VictoryChart,
  VictoryContainer,
  VictoryAxis,
  VictoryTooltip,
  VictoryScatter,
  VictoryLabel,
  VictoryTheme,
} from "victory";
const { VictoryPortal } = require("victory");
import { format, isEqual, parse } from "date-fns";

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

function groupByDateTime(info: IPostgresInfo[]) {
  const group = info.reduce(
    (accu, item) => {
      if (!item || !item.query_start) {
        return accu;
      }

      const formattedDate = format(item.query_start, "YYYY-MM-DDTHH:mm:ss");
      let isFound = false;

      let newArr = accu.map(p => {
        if (isEqual(p.time, formattedDate)) {
          isFound = true;

          return {
            ...p,
            count: p.count + 1,
          };
        }

        return p;
      });

      if (!isFound) {
        newArr = [
          ...newArr,
          {
            time: parse(formattedDate),
            count: 1,
          },
        ];
      }

      return newArr;
    },
    [] as { time: Date; count: number }[]
  );

  return group;
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
    <>
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
        </Col>
      </Row>

      <Row>
        <Col xs={12}>
          <VictoryChart
            theme={VictoryTheme.material}
            style={{
              parent: {
                boxShadow: "1px 2px 15px rgba(130, 130, 130, 0.3)",
              },
            }}
            height={300}
            width={600}
            padding={60}
            containerComponent={<VictoryContainer responsive={false} />}
          >
            <VictoryScatter
              labelComponent={<VictoryTooltip />}
              data={groupByDateTime(info).map(p => {
                return {
                  ...p,
                  label: `${format(p.time, "MM/DD/YYYY HH:mm:ssa")}: ${
                    p.count
                  }`,
                };
              })}
              x="time"
              y="count"
              style={{
                data: {
                  strokeWidth: 3,
                  stroke: "#222",
                },
              }}
            />

            <VictoryAxis
              label="Time"
              tickFormat={p => format(p, "HH:mm:ssa")}
              style={{
                axisLabel: { display: "none" },
                tickLabels: { padding: 20 },
              }}
              tickLabelComponent={
                <VictoryPortal>
                  <VictoryLabel />
                </VictoryPortal>
              }
            />

            <VictoryAxis
              dependentAxis
              scale="linear"
              tickFormat={t => Math.round(t)}
              label="Count"
              style={{
                axisLabel: { padding: 30 },
              }}
              tickLabelComponent={
                <VictoryPortal>
                  <VictoryLabel />
                </VictoryPortal>
              }
            />
          </VictoryChart>
        </Col>
      </Row>

      <Row style={{ marginTop: 50 }}>
        <Col xs={12}>
          <h3>Recently Ran Queries</h3>
          {info &&
            info.map(item => <QueryCard key={item.pid} queryData={item} />)}
        </Col>
      </Row>
    </>
  );
}
