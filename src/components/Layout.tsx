import { styled } from "@macaron-css/solid";
import { type Component } from "solid-js";

import DeskTop from "./DeskTop";
import TaskBar from "./TaskBar";
import Windows from "./Windows";

const Container = styled("div", {
  base: {
    position: "relative",
    width: "100%",
    height: "100vh",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    userSelect: "none",
  },
});

const WindowsContainer = styled("div", {
  base: {
    position: "relative",
    width: "100%",
    height: "100%",
  },
});

const Layout: Component = () => {
  return (
    <>
      <Container>
        <WindowsContainer>
          <DeskTop />
          <Windows />
        </WindowsContainer>
        <TaskBar />
      </Container>
    </>
  );
};

export default Layout;
