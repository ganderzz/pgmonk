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
import Main from "./Pages/main";

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
            <NavLink tag={Link} getProps={isPartiallyActive} to="/other">
              Other
            </NavLink>
          </NavItem>
        </Nav>
      </Navbar>

      <Container style={{ marginTop: 20 }}>
        <React.Suspense fallback={<Spinner style={{ marginTop: 10 }} />}>
          <Router>
            <Main path="/" />
          </Router>
        </React.Suspense>
      </Container>
    </section>
  );
}
