/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { styled } from "@macaron-css/solid";
import { For, Show } from "solid-js";

import { MAIN_SCENE_NAME } from "../../consts";
import { useObsWebSocket } from "../../contexts/useObsWebSocket";
import useSceneItems from "../../lib/useSceneItems";
import { primitiveColors } from "../../theme/color";

import { type WindowType, defaultWindowData } from "./WindowContent";
import { useWindow } from "./Windows";

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

const EditPopup = () => {
  const [store, { setState, index }] = useWindow();
  const [obs] = useObsWebSocket()!;
  const { sceneItems } = useSceneItems(obs()!, MAIN_SCENE_NAME);

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

export default EditPopup;
