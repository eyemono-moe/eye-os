/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { styled } from "@macaron-css/solid";
import { For, Show } from "solid-js";

import { MAIN_SCENE_NAME } from "../../consts";
import { useObsWebSocket } from "../../contexts/useObsWebSocket";
import useSceneItems from "../../lib/useSceneItems";
import { primitiveColors } from "../../theme/color";
import { useWindow } from "../Windows";

import { type WindowType, defaultWindowData } from "./WindowContent";

const Container = styled("div", {
  base: {
    width: "100%",
    height: "100%",
    padding: "8px",
    backgroundColor: primitiveColors.black,
    borderRadius: "8px",
  },
});

const Ul = styled("ul", {
  base: {
    listStyle: "none",
  },
});

const WindowDataEditor = () => {
  const [store, { setState, index }] = useWindow();
  const {
    obsResource: [obs],
  } = useObsWebSocket();
  const { sceneItems } = useSceneItems(obs()!, MAIN_SCENE_NAME);

  return (
    <Container>
      <Ul>
        <li>
          title
          <input
            type="text"
            value={store.title}
            onInput={(e) => {
              setState("windows", index(), "title", e.target.value);
            }}
          />
        </li>
        <li>
          type
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
        </li>
        <Show when={sceneItems.state === "ready"}>
          <li>
            link obs
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
          </li>
        </Show>
      </Ul>
    </Container>
  );
};

export default WindowDataEditor;
