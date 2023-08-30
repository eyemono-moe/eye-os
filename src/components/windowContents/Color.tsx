import { styled } from "@macaron-css/solid";
import { type Component } from "solid-js";
import { type SetStoreFunction } from "solid-js/store";

import { type WindowInfo } from "../../contexts/useWindows";
import usePopup from "../../lib/usePopup";
import UIColorInput from "../UI/UIColorInput";
import { type WindowData } from "../window/WindowContent";
import { useWindow } from "../Windows";

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
  const { Popup, open, setBaseElement } = usePopup();
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
      ref={setBaseElement}
      onPointerDown={(e) => {
        if (e.button !== 2) return;
        open();
      }}
      onContextMenu={(e) => {
        e.preventDefault();
      }}
      style={{
        "background-color": state.option.color,
      }}
    >
      <Popup>
        <UIColorInput
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
