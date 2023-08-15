import { styled } from "@macaron-css/solid";

import { primitiveColors } from "../theme/color";

const CircularButton = styled("button", {
  base: {
    width: "100%",
    height: "auto",
    aspectRatio: "1",
    borderRadius: "50%",
    backgroundColor: primitiveColors.black,
    borderColor: primitiveColors.pink[400],
    borderWidth: "4px",
    outline: "none",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: "1",
    selectors: {
      "&:hover": {
        backgroundColor: primitiveColors.gray[900],
      },
    },
  },
});

export default CircularButton;
