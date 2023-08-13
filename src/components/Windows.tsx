import { styled } from "@macaron-css/solid";
import { For, type Component, createContext, useContext } from "solid-js";
import { type SetStoreFunction } from "solid-js/store";

import {
  type WindowInfo,
  useWindows,
  type WindowsContextState,
} from "../contexts/useWindows";
import useSceneItemIndex from "../lib/useSceneItemIndex";

import Window from "./window/Window";

const Container = styled("div", {
  base: {
    position: "relative",
    width: "100%",
    height: "100%",
    top: "0",
    left: "0",
    pointerEvents: "none",
  },
});

export type WindowContextValue = [
  state: WindowInfo,
  actions: {
    setState: SetStoreFunction<WindowsContextState>;
    setTop: () => Promise<void>;
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
    maximized: false,
    type: "empty",
    option: {},
    zIndex: 0,
  },
  {
    setState: () => {},
    setTop: async () => {
      await Promise.resolve();
    },
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
          const { setTop: setTopInOBS } = useSceneItemIndex(
            () => window.linkSceneItemId ?? -1,
          );

          return (
            <WindowContext.Provider
              value={[
                window,
                {
                  setState,
                  setTop: async () => {
                    setTop(i());
                    if (window.linkSceneItemId !== undefined) {
                      await setTopInOBS();
                    }
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
