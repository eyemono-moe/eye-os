import { styled } from "@macaron-css/solid";
import { type Component } from "solid-js";

import { useWindows } from "../contexts/useWindows";
import { primitiveColors, semanticColors } from "../theme/color";

const Container = styled("div", {
  base: {
    display: "grid",
    placeItems: "center",
    padding: "8px",
    cursor: "pointer",
    selectors: {
      "&:hover": {
        backgroundColor: semanticColors.ui.hoverWhite,
      },
    },
  },
});

const Mark = styled("div", {
  base: {
    width: "24px",
    height: "24px",
    backgroundColor: primitiveColors.green[500],
    borderRadius: "16px",
  },
});

const OsButton: Component = () => {
  const [_, { resetDisplay }] = useWindows();

  return (
    <Container onClick={resetDisplay}>
      <Mark />
    </Container>
  );
};

export default OsButton;
