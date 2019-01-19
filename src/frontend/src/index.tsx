import * as React from "react";
import { render } from "react-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import App from "./App";

window.onload = () => {
  render(<App />, document.getElementById("app"));
};
