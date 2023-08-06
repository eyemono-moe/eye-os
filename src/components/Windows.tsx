import { styled } from "@macaron-css/solid";
import { For, type Component } from "solid-js";

import { useWindows } from "../contexts/useWindows";

import Window from "./Window";

const Container = styled("div", {
  base: {
    position: "absolute",
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
});

const Windows: Component = () => {
  const [state] = useWindows();
  return (
    <>
      <Container>
        <For each={state.windows}>
          {(window, i) => <Window windowInfo={window} index={i} />}
        </For>
      </Container>
    </>
  );
};

export default Windows;
