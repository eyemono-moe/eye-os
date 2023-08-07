import { styled } from "@macaron-css/solid";

import { primitiveColors } from "../../theme/color";
import { type WindowData } from "../windows/WindowContent";

export interface EmptyWindowData extends WindowData {
  type: "empty";
}

export const defaultEmptyWindowData: EmptyWindowData = {
  type: "empty",
};

const Default = styled("div", {
  base: {
    width: "100%",
    height: "100%",
    backgroundColor: primitiveColors.black,
    backgroundImage: `repeating-linear-gradient(-45deg, ${primitiveColors.gray[900]}, ${primitiveColors.gray[900]} 10px, transparent 0, transparent 20px)`,
  },
});

export default Default;
