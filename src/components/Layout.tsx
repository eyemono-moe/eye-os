import { styled } from "@macaron-css/solid";
import { type Component } from "solid-js";

import { primitiveColors } from "../theme/color";

import DeskTop from "./DeskTop";
import TaskBar from "./TaskBar";
import Windows from "./windows/Windows";

const Container = styled("div", {
  base: {
    position: "relative",
    width: "100%",
    height: "100vh",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    backgroundColor: primitiveColors.green[400],
  },
});

const Layout: Component = () => {
  return (
    <>
      <Container>
        <DeskTop />
        <Windows />
        <TaskBar />
      </Container>
    </>
  );
};

export default Layout;