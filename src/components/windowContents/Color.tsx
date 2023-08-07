import { styled } from "@macaron-css/solid";
import { type Component } from "solid-js";
import { type SetStoreFunction } from "solid-js/store";

import { type WindowInfo } from "../../contexts/useWindows";
import usePopup from "../../lib/usePopup";
import { type WindowData } from "../windows/WindowContent";
import { useWindow } from "../windows/Windows";

export interface ColorWindowData extends WindowData {
  type: "color";
  option: {
    color: string;
  };
}

export const defaultColorWindowData: ColorWindowData = {
  type: "color",
  option: {
    color: "#0000ff",
  },
};

const Container = styled("div", {
  base: {
    width: "100%",
    height: "100%",
  },
});

const Color: Component = () => {
  const { Popup, open } = usePopup();
  const [state, { setState, index }] = useWindow() as [
    WindowInfo & ColorWindowData,
    {
      setState: SetStoreFunction<{
        windows: Array<WindowInfo & ColorWindowData>;
      }>;
      index: () => number;
    },
  ];

  return (
    <Container
      onClick={(e) => {
        open({
          x: e.clientX,
          y: e.clientY,
        });
      }}
      style={{
        "background-color": state.option.color,
      }}
    >
      <Popup>
        <input
          type="color"
          value={state.option.color}
          onChange={(e) => {
            setState("windows", index(), "option", "color", e.target.value);
            close();
          }}
        />
      </Popup>
    </Container>
  );
};

export default Color;
