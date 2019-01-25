import * as React from "react";
import { render } from "react-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faChevronDown,
  faChevronUp,
  faSync,
  faLock,
} from "@fortawesome/free-solid-svg-icons";

import "bootstrap/dist/css/bootstrap.min.css";

import App from "./App";

window.onload = () => {
  library.add(faChevronDown, faChevronUp, faSync, faLock);

  render(<App />, document.getElementById("app"));
};
