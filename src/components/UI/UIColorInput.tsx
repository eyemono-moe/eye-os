import { styled } from "@macaron-css/solid";

import { primitiveColors } from "../../theme/color";

const UIColorInput = styled("input", {
  base: {
    height: "24px",
    padding: "0",
    borderRadius: "4px",
    border: "1px solid",
    borderColor: primitiveColors.gray[800],
    backgroundColor: primitiveColors.gray[900],
    color: primitiveColors.white,
    cursor: "pointer",
  },
  variants: {
    full: {
      true: {
        width: "100%",
      },
    },
  },
});

export default UIColorInput;
