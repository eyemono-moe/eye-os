import { styled } from "@macaron-css/solid";
import { For, type Component } from "solid-js";

import { useWindows } from "../../contexts/useWindows";
import { primitiveColors } from "../../theme/color";

import { windowContentsMap } from "./WindowContent";

const Container = styled("div", {
  base: {
    backgroundColor: primitiveColors.black,
    padding: "8px",
    borderRadius: "8px",
  },
});

const Setting = styled("div", {
  base: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "8px",
  },
});

interface EditPopupProps {
  index: () => number;
}

const EditPopup: Component<EditPopupProps> = (props) => {
  const [store, { setState }] = useWindows();

  return (
    <Container>
      <ul>
        <li>
          <Setting>
            <div>title</div>
            <input
              type="text"
              value={store.windows[props.index()].title}
              onChange={(e) => {
                setState("windows", props.index(), "title", e.target.value);
              }}
            />
          </Setting>
        </li>
        <li>
          <Setting>
            <div>type</div>
            <select
              value={store.windows[props.index()].type}
              onChange={(e) => {
                setState(
                  "windows",
                  props.index(),
                  "type",
                  e.target.value as keyof typeof windowContentsMap,
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
