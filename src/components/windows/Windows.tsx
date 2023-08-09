import { styled } from "@macaron-css/solid";
import { For, type Component, createContext, useContext } from "solid-js";
import { type SetStoreFunction } from "solid-js/store";

import {
  type WindowInfo,
  useWindows,
  type WindowsContextState,
} from "../../contexts/useWindows";

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

export type WindowContextValue = [
  state: WindowInfo,
  actions: {
    setState: SetStoreFunction<WindowsContextState>;
    setTop: () => void;
    removeWindow: () => void;
    index: () => number;
  },
];

const WindowContext = createContext<WindowContextValue>([
  {
    title: "",
    icon: "",
    x: 0,
    y: 0,
    width: 300,
    height: 200,
    color: "",
    minimized: false,
    type: "empty",
    option: {},
    zIndex: 0,
  },
  {
    setState: () => {},
    setTop: () => {},
    removeWindow: () => {},
    index: () => 0,
  },
]);

const Windows: Component = () => {
  const [state, { setState, removeWindow, setTop }] = useWindows();
  return (
    <Container>
      <For each={state.windows}>
        {(window, i) => {
          return (
            <WindowContext.Provider
              value={[
                window,
                {
                  setState,
                  setTop: () => {
                    setTop(i());
                  },
                  removeWindow: () => {
                    removeWindow(i());
                  },
                  index: i,
                },
              ]}
            >
              <Window />
            </WindowContext.Provider>
          );
        }}
      </For>
    </Container>
  );
};

export const useWindow = () => useContext(WindowContext);

export default Windows;
