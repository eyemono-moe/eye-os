/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { styled } from "@macaron-css/solid";
import { For, type Component, createContext, useContext } from "solid-js";
import { type SetStoreFunction } from "solid-js/store";

import { MAIN_SCENE_NAME } from "../consts";
import { useObsWebSocket } from "../contexts/useObsWebSocket";
import {
  type WindowInfo,
  useWindows,
  type WindowsContextState,
} from "../contexts/useWindows";
import useSceneItemIndex from "../lib/useSceneItemIndex";
import useSceneItems from "../lib/useSceneItems";

import Window from "./window/Window";

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
  const {
    obsResource: [obs],
  } = useObsWebSocket();
  const sceneItemIndexFactory = useSceneItemIndex(obs()!, MAIN_SCENE_NAME);
  const { sceneItems } = useSceneItems(obs()!, MAIN_SCENE_NAME);
  const setTopInObs = async (index: number) => {
    const { setIndex } = sceneItemIndexFactory(() => index);
    if (sceneItems.state === "ready") {
      await setIndex(sceneItems().length - 2);
    }
  };

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
                  setTop: async () => {
                    setTop(i());
                    if (window.linkSceneItemId !== undefined) {
                      await setTopInObs(window.linkSceneItemId);
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
