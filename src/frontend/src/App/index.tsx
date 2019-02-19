import * as React from "react";
import {
  Container,
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
const { Spinner } = require("reactstrap");
import { Router, Link } from "@reach/router";
import Dashboard from "./Pages/Dashboard";
import Logs from "./Pages/Logs";
import Databases from "./Pages/Databases/Databases";

const isPartiallyActive = ({ isCurrent }) => {
  return isCurrent
    ? {
        style: {
          color: "#FFF",
          borderBottom: "4px solid #45a2ff",
          padding: 12,
        },
      }
    : {
        style: {
          color: "#FFF",
          padding: 12,
        },
      };
};

export default function App() {
  return (
    <section>
      <Navbar color="dark" style={{ color: "#FFF", padding: 0 }} expand="md">
        <NavbarBrand
          tag={Link}
          to="/"
          style={{
            padding: ".5rem 1rem",
            color: "#FFF",
            textDecoration: "none",
          }}
        >
          <h4 style={{ margin: 0 }}>PgMonk</h4>
        </NavbarBrand>

        <Nav className="ml-auto" navbar>
          <NavItem>
            <NavLink tag={Link} getProps={isPartiallyActive} to="/">
              Dashboard
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink tag={Link} getProps={isPartiallyActive} to="/databases">
              Databases
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink tag={Link} getProps={isPartiallyActive} to="/logs">
              Logs
            </NavLink>
          </NavItem>
        </Nav>
      </Navbar>

      <Container
        style={{ height: "calc(100% - 52px)", margin: 0, maxWidth: "100%" }}
      >
        <React.Suspense fallback={<Spinner style={{ marginTop: 10 }} />}>
          <Router>
            <Dashboard path="/" />
            <Logs path="/logs" />
            <Databases path="/databases" />
          </Router>
        </React.Suspense>
      </Container>
    </section>
  );
}
