import * as React from "react";
import { Row, Col, Button } from "reactstrap";
import { HTTP } from "../../utils/API";
import { toast } from "react-toastify";
import { Tree } from "../../Components/Tree";
import { ITable } from "../../utils/Interfaces/ITable";
import { TableDisplay } from "./Components/TableDisplay";

interface IProps {
  path?: string;
}

interface IRouterProps {
  location: {
    search: string;
    pathname: string;
  };
  navigate: (path: string) => void;
}

export function useDatabaseInfoFetcher() {
  const [isLoading, setLoading] = React.useState(false);
  const [databases, setDbs] = React.useState<
    Partial<{ [catalog: string]: { [schema: string]: string[] } }>[]
  >([]);

  function getDatabases() {
    setLoading(true);

    return HTTP.getDatabases()
      .then(dbs => {
        const groupedDbs = dbs.reduce((accu, item) => {
          const currentTableCatalog = accu[item.table_catalog];
          const tableNames = [
            ...((currentTableCatalog &&
              currentTableCatalog[item.table_schema]) ||
              []),
            item.table_name,
          ];

          const schemas = {
            ...(currentTableCatalog || {}),
            [item.table_schema]: tableNames,
          };

          return {
            ...(accu || {}),
            [item.table_catalog]: schemas,
          };
        }, {});

        setDbs(groupedDbs as any);
        setLoading(false);
      })
      .catch(response => {
        setLoading(false);
        toast.error(response.message);

        return Promise.reject();
      });
  }

  return {
    databases,
    getDatabases,
    isLoading,
  };
}

function useTableInfoFetch(props: IProps & IRouterProps) {
  const [isLoading, setLoading] = React.useState(false);
  const [table, setTable] = React.useState<ITable>({
    deletes: 0,
    idx_scan: 0,
    inserts: 0,
    isx_tup_fetch: 0,
    schema_name: "",
    seq_reads: 0,
    seq_scan: 0,
    table_name: "",
    updates: 0,
  });

  function getTable(name: string) {
    setLoading(true);

    return HTTP.getTable(name)
      .then(info => {
        setTable(info);
        setLoading(false);
        props.navigate(props.location.pathname + "?table=" + name);
      })
      .catch(response => {
        setLoading(false);
        toast.error(response.message);

        return Promise.reject();
      });
  }

  return {
    table,
    getTable,
    isLoading,
  };
}

export function Databases(props: IProps & IRouterProps) {
  const { databases, getDatabases } = useDatabaseInfoFetcher();
  const { table, getTable } = useTableInfoFetch(props);

  React.useEffect(() => {
    getDatabases();
  }, []);

  React.useEffect(() => {
    if (props.location.search && props.location.search.indexOf("table=") >= 0) {
      getTable(props.location.search.split("table=")[1]);
    }
  }, []);

  return (
    <div style={{ display: "grid", gridTemplateRows: "100%", height: "100%" }}>
      <Row>
        <Col
          xs={4}
          md={3}
          lg={2}
          xl={2}
          style={{
            background: "#F1F1F1",
            borderRight: "1px solid #DDD",
            padding: 15,
          }}
        >
          {databases &&
            Object.keys(databases).map((catagory, i) => {
              const activeTableInCatagory = Object.values(
                databases[catagory]
              ).filter(p => {
                if (Array.isArray(p)) {
                  return p.indexOf(table.table_name) >= 0;
                }

                return false;
              });

              return (
                <Tree
                  header={catagory}
                  onItemClick={getTable}
                  key={i}
                  activeItem={table.table_name}
                  open={activeTableInCatagory.length > 0}
                >
                  {databases[catagory]}
                </Tree>
              );
            })}
        </Col>

        <Col xs={8} md={9} lg={10} xl={10} style={{ padding: 20 }}>
          {table && <TableDisplay data={table} />}
        </Col>
      </Row>
    </div>
  );
}

//@todo: fix typings so we don't have to nest functions
export default (props: IProps) => Databases(props as any);
