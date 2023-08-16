/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { styled } from "@macaron-css/solid";
import { For, Show } from "solid-js";

import { useGlobalConfig } from "../../contexts/useGlobalConfig";
import generateWindowColor from "../../lib/generateWindowColor";
import useSceneItems from "../../lib/useSceneItems";
import { primitiveColors } from "../../theme/color";
import UIButton from "../UI/UIButton";
import UIColorInput from "../UI/UIColorInput";
import UIInput from "../UI/UIInput";
import UISelect from "../UI/UISelect";
import { useWindow } from "../Windows";

import { type WindowType, defaultWindowData } from "./WindowContent";

const Container = styled("div", {
  base: {
    width: "100%",
    height: "100%",
    padding: "8px",
    backgroundColor: primitiveColors.black,
    borderRadius: "8px",

    border: "1px solid",
    borderColor: primitiveColors.gray[800],
    boxShadow: `4px 4px 12px 2px ${primitiveColors.blackAlpha[400]}`,

    display: "grid",
    gridTemplateColumns: "auto 1fr",
    gap: "8px",
  },
});

const WindowDataEditor = () => {
  const [config] = useGlobalConfig();
  const [store, { setState, index }] = useWindow();
  const { sceneItems } = useSceneItems();

  return (
    <Container>
      title
      <UIInput
        type="text"
        value={store.title}
        onInput={(e) => {
          setState("windows", index(), "title", e.target.value);
        }}
      />
      type
      <UISelect
        value={store.type}
        onChange={(e) => {
          setState("windows", index(), (info) => {
            const d = JSON.parse(
              JSON.stringify(
                defaultWindowData[e.currentTarget.value as WindowType],
              ),
            );
            return {
              ...info,
              type: d.type,
              option: d.option,
            };
          });
        }}
      >
        <For each={Object.keys(defaultWindowData)}>
          {(type) => <option value={type}>{type}</option>}
        </For>
      </UISelect>
      color
      <div
        style={{
          display: "flex",
          gap: "8px",
          "flex-wrap": "nowrap",
        }}
      >
        <UIColorInput
          type="color"
          value={store.color}
          onChange={(e) => {
            setState("windows", index(), "color", e.target.value);
          }}
        />
        <UIButton
          type="button"
          onClick={() => {
            setState("windows", index(), "color", generateWindowColor());
          }}
        >
          randomize
        </UIButton>
      </div>
      <Show
        when={
          sceneItems[config.currentSceneName] !== undefined &&
          sceneItems[config.currentSceneName].length > 0
        }
      >
        link obs
        <UISelect
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
          <For each={sceneItems[config.currentSceneName]}>
            {(item) => (
              <option value={item.sceneItemId as number}>
                {item.sourceName as string}
              </option>
            )}
          </For>
        </UISelect>
      </Show>
    </Container>
  );
};

export default WindowDataEditor;
