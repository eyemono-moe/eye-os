import {
  createGlobalTheme,
  createGlobalThemeContract,
} from "@macaron-css/core";
import { createPicker, type EmojiPicker } from "picmo";
import { onMount, type Component } from "solid-js";

import { primitiveColors, semanticColors } from "../../theme/color";
import { fontFamily } from "../../theme/font";
import { useWindow } from "../Windows";

const className = "my-picker";

const IconEditor: Component = () => {
  let ref: HTMLDivElement;
  let picker: EmojiPicker;

  const [_, { setState, index }] = useWindow();

  const openPicker = () => {
    picker = createPicker({
      rootElement: ref,
      showPreview: false,
      className: "my-picker",
    });
    picker.addEventListener("emoji:select", (selection) => {
      setState("windows", index(), "icon", selection.emoji);
    });
  };

  onMount(openPicker);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return <div ref={ref!} />;
};

export default IconEditor;

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
    background: { color: primitiveColors.black },
    focus: { background: { color: primitiveColors.black } },
    icon: { color: primitiveColors.gray[600] },
    placeholder: { color: primitiveColors.gray[600] },
  },
  secondary: {
    background: { color: primitiveColors.pink[400] },
    text: { color: primitiveColors.pink[600] },
  },
  tag: { background: { color: primitiveColors.pink[400] } },
  text: { color: semanticColors.text.white },
  ui: { font: fontFamily.mono },
  variant: { popup: { background: { color: primitiveColors.pink[400] } } },
});
