import { styled } from "@macaron-css/solid";
import { type Component } from "solid-js";

import GameScreenContainer from "./GameScreenContainer";
import Infos from "./Infos";
import Windows from "./Windows";

const Container = styled("div", {
  base: {
    width: "100%",
    height: "100vh",
    overflow: "hidden",
    display: "flex",
    flexDirection: "row",
  },
});
const Left = styled("div", {
  base: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
});
const Right = styled("div", {
  base: {
    width: "100%",
    height: "100%",
    display: "flex",
  },
});
const NoShrink = styled("div", {
  base: {
    flexShrink: 0,
  },
});

const Layout: Component = () => {
  return (
    <Container>
      <Left>
        <NoShrink>
          <GameScreenContainer />
        </NoShrink>
        <Infos />
      </Left>
      <Right />
      <Windows />
    </Container>
  );
};

export default Layout;
