import { styled } from "@macaron-css/solid";
import { type Component } from "solid-js";

import { semanticColors } from "../theme/color";

const borderRadius = 16;
const padding = 16;

const Container = styled("div", {
  base: {
    width: "100%",
    overflow: "hidden",
    padding: `${padding}px`,
  },
});

const GameScreen = styled("div", {
  base: {
    width: "100%",
    height: "auto",
    aspectRatio: "16 / 9",
    boxSizing: "content-box",
    outlineStyle: "solid",
    outlineColor: semanticColors.ui.background,
    outlineWidth: `${borderRadius + padding}px`,
    borderRadius: `${borderRadius}px`,
  },
});

const GameScreenContainer: Component = () => {
  return (
    <Container>
      <GameScreen />
    </Container>
  );
};

export default GameScreenContainer;
