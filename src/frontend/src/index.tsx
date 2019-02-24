import * as React from "react";
import { render } from "react-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faChevronDown,
  faChevronUp,
  faSync,
  faLock,
  faChevronRight,
  faInfoCircle,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import App from "./App";
import { ToastContainer } from "react-toastify";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.min.css";

window.onload = () => {
  library.add(
    faChevronDown,
    faChevronUp,
    faChevronRight,
    faSync,
    faLock,
    faInfoCircle,
    faMinus
  );

  render(
    <>
      <App />
      <ToastContainer position="bottom-left" />
    </>,
    document.getElementById("app")
  );
};
