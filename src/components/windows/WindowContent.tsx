import { lazy, type Component } from "solid-js";
import { Dynamic } from "solid-js/web";

import { type ClockWindowOptions } from "../windowContents/Clock";
import { type ColorWindowOptions } from "../windowContents/Color";
import { type DefaultWindowOptions } from "../windowContents/Default";
import { type NoteWindowOptions } from "../windowContents/Note";

import { useWindow } from "./Windows";

export const windowContentsMap = {
  clock: lazy(async () => await import("../windowContents/Clock")),
  color: lazy(async () => await import("../windowContents/Color")),
  default: lazy(async () => await import("../windowContents/Default")),
  note: lazy(async () => await import("../windowContents/Note")),
};

export type WindowType = keyof typeof windowContentsMap;

export interface WindowData {
  type: WindowType;
  option?: unknown;
}

export type WindowDataConcrete =
  | ClockWindowOptions
  | ColorWindowOptions
  | DefaultWindowOptions
  | NoteWindowOptions;

const WindowContent: Component = () => {
  const [state] = useWindow();
  return <Dynamic component={windowContentsMap[state.type]} />;
};

export default WindowContent;
