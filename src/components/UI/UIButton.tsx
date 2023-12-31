import { styled } from "@macaron-css/solid";

import { primitiveColors } from "../../theme/color";

const UIButton = styled("button", {
  base: {
    width: "100%",
    height: "24px",
    padding: "4px",
    borderRadius: "4px",
    border: "1px solid",
    borderColor: primitiveColors.gray[800],
    backgroundColor: primitiveColors.gray[700],
    color: primitiveColors.white,
    cursor: "pointer",
    selectors: {
      "&:hover": {
        backgroundColor: primitiveColors.gray[800],
      },
    },
  },
  variants: {
    danger: {
      true: {
        backgroundColor: primitiveColors.pink[500],
        selectors: {
          "&:hover": {
            backgroundColor: primitiveColors.pink[700],
          },
        },
      },
    },
  },
});

export default UIButton;
