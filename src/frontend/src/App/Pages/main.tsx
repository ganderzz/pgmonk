import * as React from "react";
import { Row, Col, FormGroup, Input, Button } from "reactstrap";
import { HTTP } from "../utils/API";

interface IProps {
  path?: string;
}

export function Main(props: IProps) {
  const [inputValue, setInputValue] = React.useState("");
  const [data, setUsers] = React.useState<{ ID: number; Name: string }[]>([]);

  React.useEffect(() => {
    HTTP.getUsers().then(users => {
      setUsers(users);
    });
  }, []);

  return (
    <Row>
      <Col xs={12}>
        <FormGroup>
          <Input
            type="text"
            style={{
              width: "50%",
              display: "inline-block",
              marginRight: 5,
            }}
            value={inputValue}
            onChange={e => setInputValue(e.currentTarget.value)}
            placeholder="Enter Name!"
          />
          {/* <Button color="success" onClick={() => createUser(inputValue)}>
            Submit
          </Button> */}
        </FormGroup>

        {data &&
          data.map(d => (
            <div style={{ marginTop: 10 }} key={d.ID}>
              {d.ID}: {d.Name}
            </div>
          ))}
      </Col>
    </Row>
  );
}
