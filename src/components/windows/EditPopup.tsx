import { styled } from "@macaron-css/solid";
import { For, type Component, Show } from "solid-js";

import { MAIN_SCENE_NAME } from "../../consts";
import { useObsWebSocket } from "../../contexts/useObsWebSocket";
import useSceneItems from "../../lib/useSceneItems";
import { primitiveColors } from "../../theme/color";

import LoadingScreen from "./LoadingScreen";
import { type WindowType, defaultWindowData } from "./WindowContent";
import { useWindow } from "./Windows";

import type OBSWebSocket from "obs-websocket-js";

const Container = styled("div", {
  base: {
    backgroundColor: primitiveColors.black,
    padding: "8px",
    borderRadius: "8px",
  },
});

export const Setting = styled("div", {
  base: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "8px",
  },
});

const Ul = styled("ul", {
  base: {
    listStyle: "none",
  },
});

const OBSProvider: Component = () => {
  const obsResource = useObsWebSocket();
  return (
    <Show
      when={obsResource != null && obsResource[0].state === "ready"}
      fallback={<LoadingScreen />}
    >
      {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
      <EditPopup obs={obsResource![0]()!} />
    </Show>
  );
};

const EditPopup: Component<{
  obs: OBSWebSocket;
}> = (props) => {
  const [store, { setState, index }] = useWindow();
  const { sceneItems } = useSceneItems(props.obs, MAIN_SCENE_NAME);

  return (
    <Container>
      <Ul>
        <li>
          <Setting>
            <div>title</div>
            <input
              type="text"
              value={store.title}
              onChange={(e) => {
                setState("windows", index(), "title", e.target.value);
              }}
            />
          </Setting>
        </li>
        <li>
          <Setting>
            <div>type</div>
            <select
              value={store.type}
              onChange={(e) => {
                setState("windows", index(), (info) => {
                  const newInfo = { ...info };
                  newInfo.type = e.target.value as WindowType;
                  newInfo.option =
                    defaultWindowData[e.target.value as WindowType].option;
                  return newInfo;
                });
              }}
            >
              <For each={Object.keys(defaultWindowData)}>
                {(type) => <option value={type}>{type}</option>}
              </For>
            </select>
          </Setting>
        </li>
        <Show when={sceneItems.state === "ready"}>
          <li>
            <Setting>
              <div>link</div>
              <select
                onChange={(e) => {
                  const id = parseInt(e.target.value, 10);
                  setState(
                    "windows",
                    index(),
                    "linkSceneItemId",
                    Number.isNaN(id) ? undefined : id,
                  );
                }}
                value={
                  store.linkSceneItemId !== undefined
                    ? store.linkSceneItemId.toString()
                    : "none"
                }
              >
                <option value={"none"}>none</option>
                <For each={sceneItems()}>
                  {(item) => (
                    <option value={item.sceneItemId as number}>
                      {item.sourceName as string}
                    </option>
                  )}
                </For>
              </select>
            </Setting>
          </li>
        </Show>
      </Ul>
    </Container>
  );
};

export default OBSProvider;
