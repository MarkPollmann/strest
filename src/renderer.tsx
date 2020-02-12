import "../assets/base.css";
import React from "react";
import { render } from "react-dom";
import App from "./App";

render(<App />, document.getElementById("app"));

declare let module: { hot: any };

if (module.hot) {
  module.hot.accept("./App", () => {
    const NewApp = require("./App").default;

    render(<NewApp />, document.getElementById("app"));
  });
}
