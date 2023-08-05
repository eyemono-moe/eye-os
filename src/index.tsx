/* @refresh reload */
import { globalStyle } from "@macaron-css/core";
import { render } from "solid-js/web";

import App from "./App";

const root = document.getElementById("root");

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
render(() => <App />, root!);

globalStyle("*", {
  boxSizing: "border-box",
  margin: 0,
  padding: 0,
});
