import { styled } from "@macaron-css/solid";
import { type Component } from "solid-js";

import { primitiveColors } from "../../theme/color";

const Container = styled("div", {
  base: {
    width: "100%",
    height: "100%",
    backgroundColor: primitiveColors.black,
    backgroundImage: `repeating-linear-gradient(-45deg, ${primitiveColors.gray[900]}, ${primitiveColors.gray[900]} 10px, transparent 0, transparent 20px)`,
    display: "grid",
    placeItems: "center",
  },
});

const Wrapper = styled("div", {
  base: {
    width: "80%",
  },
});

const ProgressBar = styled("div", {
  base: {
    width: "100%",
    height: "24px",
    backgroundColor: primitiveColors.gray[400],
    backgroundImage: `linear-gradient(90deg, ${primitiveColors.green[400]}, ${primitiveColors.green[400]} 83%, transparent 0)`,
    borderRadius: "4px",
  },
});

const LoadingScreen: Component = () => {
  return (
    <Container>
      <Wrapper>
        Now Loading...
        <ProgressBar />
      </Wrapper>
    </Container>
  );
};

export default LoadingScreen;
