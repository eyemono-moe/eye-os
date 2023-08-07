import { styled } from "@macaron-css/solid";
import { For, type Component } from "solid-js";

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

const EditPopup: Component = () => {
  const [store, { setState, index }] = useWindow();

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
      </Ul>
    </Container>
  );
};

export default EditPopup;
