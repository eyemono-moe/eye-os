import { styled } from "@macaron-css/solid";

import { primitiveColors } from "../../theme/color";
import { type WindowData } from "../windows/WindowContent";

export interface DefaultWindowOptions extends WindowData {
  type: "default";
}

export const defaultOptions: DefaultWindowOptions = {
  type: "default",
};

const Default = styled("div", {
  base: {
    width: "100%",
    height: "100%",
    backgroundColor: primitiveColors.black,
    backgroundImage: `repeating-linear-gradient(-45deg, ${primitiveColors.gray[50]}, ${primitiveColors.gray[50]} 10px, transparent 0, transparent 20px)`,
  },
});

export default Default;
