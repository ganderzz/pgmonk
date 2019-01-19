import * as React from "react";
import { Container, Navbar, NavbarBrand } from "reactstrap";
import { Router, Link } from "@reach/router";
import { HTTP } from "./utils/API";
import { Main } from "./Pages/main";

interface IState {
  data: { ID: number; Name: string }[];
  inputValue: string;
}

export default class App extends React.Component {
  public readonly state: IState = {
    data: [],
    inputValue: "",
  };

  public componentDidMount() {
    this.loadData();
  }

  private loadData = () => {
    HTTP.getUsers().then((data: IState["data"]) => {
      this.setState({
        data,
      });
    });
  };

  private createUser = () => {
    HTTP.createUser(this.state.inputValue).then(() => {
      this.setState({ inputValue: "" });
      this.loadData();
    });
  };

  public render() {
    return (
      <section>
        <Navbar color="dark" style={{ color: "#FFF" }} expand="md">
          <NavbarBrand>
            <h4 style={{ margin: 0 }}>PgMonk</h4>
          </NavbarBrand>
        </Navbar>

        <Container style={{ marginTop: 20 }}>
          <Router>
            <Main path="/" />
          </Router>
        </Container>
      </section>
    );
  }
}
