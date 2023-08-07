import { styled } from "@macaron-css/solid";
import { For, type Component } from "solid-js";

import { primitiveColors } from "../../theme/color";

import { type WindowType, windowContentsMap } from "./WindowContent";
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

const EditPopup: Component = () => {
  const [store, { setState, index }] = useWindow();

  return (
    <Container>
      <ul>
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
                setState(
                  "windows",
                  index(),
                  "type",
                  e.target.value as WindowType,
                );
              }}
            >
              <For each={Object.keys(windowContentsMap)}>
                {(type) => <option value={type}>{type}</option>}
              </For>
            </select>
          </Setting>
        </li>
      </ul>
    </Container>
  );
};

export default EditPopup;
