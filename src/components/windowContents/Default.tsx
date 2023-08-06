import { styled } from "@macaron-css/solid";

import { primitiveColors } from "../../theme/color";

const Default = styled("div", {
  base: {
    width: "100%",
    height: "100%",
    backgroundColor: primitiveColors.black,
    backgroundImage: `repeating-linear-gradient(-45deg, ${primitiveColors.gray[50]}, ${primitiveColors.gray[50]} 10px, transparent 0, transparent 20px)`,
  },
});

export default Default;
