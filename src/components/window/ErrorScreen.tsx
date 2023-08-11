import { styled } from "@macaron-css/solid";
import { FaSolidTriangleExclamation } from "solid-icons/fa";
import { type Component } from "solid-js";

import { primitiveColors, semanticColors } from "../../theme/color";

const Container = styled("div", {
  base: {
    width: "100%",
    height: "100%",
    background: semanticColors.ui.background,
    display: "grid",
    placeItems: "center",
    placeContent: "center",
    gap: "16px",
    padding: "16px",
  },
});

const ErrorScreen: Component<{
  message?: string;
}> = (props) => {
  return (
    <Container>
      <FaSolidTriangleExclamation size={64} fill={primitiveColors.pink[400]} />
      {props.message ?? "An error has occurred."}
    </Container>
  );
};

export default ErrorScreen;
