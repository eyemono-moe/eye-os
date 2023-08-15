import { styled } from "@macaron-css/solid";

import { type WindowData } from "../window/WindowContent";

export interface EmptyWindowData extends WindowData {
  type: "empty";
}

export const defaultEmptyWindowData: EmptyWindowData = {
  type: "empty",
};

const Empty = styled("div", {
  base: {
    width: "100%",
    height: "100%",
  },
});

export default Empty;
