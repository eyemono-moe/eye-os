import {
  createGlobalTheme,
  createGlobalThemeContract,
} from "@macaron-css/core";
import { styled } from "@macaron-css/solid";
import { createPicker, type EmojiPicker } from "picmo";
import { type Component } from "solid-js";

import usePopup from "../../lib/usePopup";
import { primitiveColors, semanticColors } from "../../theme/color";
import { fontFamily } from "../../theme/font";

import { useWindow } from "./Windows";

const className = "my-picker";

const Container = styled("div", {
  base: {
    display: "flex",
    flexDirection: "row",
    cursor: "pointer",
  },
});

const Button = styled("div", {
  base: {
    width: "32px",
    height: "32px",
    fontSize: "18px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    selectors: {
      "&:hover": {
        backgroundColor: primitiveColors.whiteAlpha[400],
      },
    },
  },
});

const EmojiButton: Component = () => {
  let ref: HTMLDivElement;
  let picker: EmojiPicker;

  const [state, { setState, index }] = useWindow();
  const { Popup, open, close } = usePopup();

  const openPicker = (e: MouseEvent) => {
    open({
      x: e.clientX,
      y: e.clientY,
    });
    picker = createPicker({
      rootElement: ref,
      showPreview: false,
      className: "my-picker",
    });
    picker.addEventListener("emoji:select", (selection) => {
      setState("windows", index(), "icon", selection.emoji);
      close();
    });
  };

  return (
    <Container>
      <Button onClick={openPicker}>{state.icon}</Button>
      <Popup>
        {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
        <div ref={ref!} />
      </Popup>
    </Container>
  );
};

export default EmojiButton;

const vars = createGlobalThemeContract(
  {
    accent: { color: null },
    background: { color: null },
    border: { color: null },
    category: {
      name: { background: { color: null }, text: { color: null } },
      tab: { color: null },
    },
    error: { color: null, dark: { color: null } },
    focus: { indicator: { color: null } },
    hover: { background: { color: null } },
    placeholder: { background: { color: null } },
    preview: { background: { color: null } },
    search: {
      background: { color: null },
      focus: { background: { color: null } },
      icon: { color: null },
      placeholder: { color: null },
    },
    secondary: { background: { color: null }, text: { color: null } },
    tag: { background: { color: null } },
    text: { color: null },
    ui: { font: null },
    variant: { popup: { background: { color: null } } },
  },
  (_, path) => `${path.join("-")}`,
);

createGlobalTheme(`div.${className}`, vars, {
  accent: { color: primitiveColors.pink[400] },
  background: { color: semanticColors.ui.background },
  border: { color: primitiveColors.pink[400] },
  category: {
    name: {
      background: { color: "transparent" },
      text: { color: semanticColors.text.white },
    },
    tab: { color: semanticColors.text.white },
  },
  error: {
    color: primitiveColors.pink[400],
    dark: { color: primitiveColors.pink[400] },
  },
  focus: { indicator: { color: primitiveColors.pink[400] } },
  hover: { background: { color: primitiveColors.pink[400] } },
  placeholder: { background: { color: primitiveColors.pink[400] } },
  preview: { background: { color: primitiveColors.pink[400] } },
  search: {
    background: { color: semanticColors.text.white },
    focus: { background: { color: semanticColors.text.white } },
    icon: { color: primitiveColors.pink[400] },
    placeholder: { color: primitiveColors.pink[600] },
  },
  secondary: {
    background: { color: primitiveColors.pink[400] },
    text: { color: primitiveColors.pink[600] },
  },
  tag: { background: { color: primitiveColors.pink[400] } },
  text: { color: primitiveColors.pink[400] },
  ui: { font: fontFamily.mono },
  variant: { popup: { background: { color: primitiveColors.pink[400] } } },
});
