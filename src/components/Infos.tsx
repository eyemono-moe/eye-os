import { styled } from "@macaron-css/solid";
import { type Component } from "solid-js";

import { semanticColors } from "../theme/color";

import NamePlate from "./NamePlate";

const Container = styled("div", {
  base: {
    width: "100%",
    height: "100vh",
    backgroundColor: semanticColors.ui.background,
    display: "flex",
    flexDirection: "row",
  },
});

const Infos: Component = () => {
  return (
    <Container>
      <NamePlate />
    </Container>
  );
};

export default Infos;
