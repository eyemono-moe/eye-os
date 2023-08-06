import { styled } from "@macaron-css/solid";
import { For, type Component } from "solid-js";

import { useWindows } from "../../contexts/useWindows";

import Window from "./Window";

const Container = styled("div", {
  base: {
    position: "fixed",
    width: "100%",
    height: "100vh",
    top: "0",
    left: "0",
    overflow: "hidden",
    pointerEvents: "none",
  },
});

const Windows: Component = () => {
  const [state] = useWindows();
  return (
    <Container>
      <For each={state.windows}>
        {(window, i) => <Window windowInfo={window} index={i} />}
      </For>
    </Container>
  );
};

export default Windows;
