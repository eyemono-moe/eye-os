import { styled } from "@macaron-css/solid";
import { type Component } from "solid-js";

import { ObsWebSocketProvider } from "../contexts/useObsWebSocket";

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
    userSelect: "none",
  },
});

const Layout: Component = () => {
  return (
    <>
      <Container>
        <DeskTop />
        <ObsWebSocketProvider>
          <Windows />
        </ObsWebSocketProvider>
        <TaskBar />
      </Container>
    </>
  );
};

export default Layout;
