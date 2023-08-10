import { styled } from "@macaron-css/solid";
import { type Component } from "solid-js";

import { primitiveColors } from "../theme/color";

import NamePlate from "./NamePlate";

const Container = styled("div", {
  base: {
    position: "relative",
    width: "100%",
    height: "100%",
    overflow: "hidden",
    backgroundColor: primitiveColors.green[400],
  },
});

const NamePlateContainer = styled("div", {
  base: {
    position: "absolute",
    bottom: "8px",
    left: "8px",
  },
});

const DeskTop: Component = () => {
  return (
    <Container>
      <NamePlateContainer>
        <NamePlate />
      </NamePlateContainer>
    </Container>
  );
};

export default DeskTop;
