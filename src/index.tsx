/* @refresh reload */
import { globalStyle } from "@macaron-css/core";
import { render } from "solid-js/web";

import App from "./App";
import { semanticColors } from "./theme/color";

const root = document.getElementById("root");

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
render(() => <App />, root!);

globalStyle("html, body", {
  fontFamily: `'JetBrainsMono Nerd Font', 'Noto Sans JP Thin', monospace`,
  color: semanticColors.text.white,
  background: "transparent",
});

globalStyle("*, *:before, *:after", {
  boxSizing: "border-box",
  margin: "0",
  padding: "0",
});
