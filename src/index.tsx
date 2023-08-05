/* @refresh reload */
import { globalStyle } from "@macaron-css/core";
import { render } from "solid-js/web";

import App from "./App";

const root = document.getElementById("root");

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
render(() => <App />, root!);

globalStyle("html, body", {
  margin: "0",
  padding: "0",
  fontFamily: `'Noto Sans JP', sans-serif`,
});

globalStyle("*, *:before, *:after", {
  boxSizing: "border-box",
});
