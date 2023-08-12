import { styled } from "@macaron-css/solid";

import { primitiveColors } from "../../theme/color";

const UIInput = styled("input", {
  base: {
    width: "100%",
    height: "24px",
    padding: "4px",
    borderRadius: "4px",
    border: "1px solid",
    borderColor: primitiveColors.gray[800],
    backgroundColor: primitiveColors.gray[900],
    color: primitiveColors.white,
  },
});

export default UIInput;
