import { styled } from "@macaron-css/solid";

import { primitiveColors } from "../../theme/color";

const HeaderButton = styled("button", {
  base: {
    width: "32px",
    height: "32px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,

    border: "none",
    outline: "none",
    backgroundColor: "transparent",

    lineHeight: "32px",

    selectors: {
      "&:hover": {
        backgroundColor: primitiveColors.whiteAlpha[400],
      },
    },
  },
  variants: {
    closeButton: {
      true: {
        selectors: {
          "&:hover": {
            backgroundColor: primitiveColors.pink[500],
          },
        },
      },
    },
  },
});

export default HeaderButton;
