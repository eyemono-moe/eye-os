import { styled } from "@macaron-css/solid";
import { For, type Component, createContext, useContext, Show } from "solid-js";
import { type SetStoreFunction } from "solid-js/store";

import { MAIN_SCENE_NAME } from "../../consts";
import { useObsWebSocket } from "../../contexts/useObsWebSocket";
import {
  type WindowInfo,
  useWindows,
  type WindowsContextState,
} from "../../contexts/useWindows";
import useSceneItemIndex from "../../lib/useSceneItemIndex";
import useSceneItems from "../../lib/useSceneItems";

import LoadingScreen from "./LoadingScreen";
import Window from "./Window";

import type OBSWebSocket from "obs-websocket-js";

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

const OBSProvider: Component = () => {
  const obsResource = useObsWebSocket();
  return (
    <Show
      when={obsResource != null && obsResource[0].state === "ready"}
      fallback={<LoadingScreen />}
    >
      {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
      <Windows obs={obsResource![0]()!} />
    </Show>
  );
};

const Windows: Component<{
  obs: OBSWebSocket;
}> = (props) => {
  const [state, { setState, removeWindow, setTop }] = useWindows();
  const sceneItemIndexFactory = useSceneItemIndex(props.obs, MAIN_SCENE_NAME);
  const { sceneItems } = useSceneItems(props.obs, MAIN_SCENE_NAME);
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

export default OBSProvider;
