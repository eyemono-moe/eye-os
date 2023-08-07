import { styled } from "@macaron-css/solid";

import { type WindowData } from "../windows/WindowContent";

export interface ColorWindowData extends WindowData {
  type: "color";
  option: {
    color: string;
  };
}

export const defaultColorWindowData: ColorWindowData = {
  type: "color",
  option: {
    color: "#0000ff",
  },
};

const Color = styled("div", {
  base: {
    width: "100%",
    height: "100%",
    background: "#0000ff",
  },
});

export default Color;
