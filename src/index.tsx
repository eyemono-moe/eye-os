/* @refresh reload */
import { globalStyle } from "@macaron-css/core";
import { render } from "solid-js/web";

import App from "./App";
import { semanticColors } from "./theme/color";
import { fontFamily } from "./theme/font";

const root = document.getElementById("root");

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
render(() => <App />, root!);

globalStyle("html, body", {
  fontFamily: fontFamily.mono,
  color: semanticColors.text.white,
  background: "transparent",
});

globalStyle("*, *:before, *:after", {
  boxSizing: "border-box",
  margin: "0",
  padding: "0",
});
