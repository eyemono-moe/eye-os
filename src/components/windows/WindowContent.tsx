import { lazy, type Component } from "solid-js";
import { Dynamic } from "solid-js/web";

import {
  defaultClockWindowData,
  type ClockWindowData,
} from "../windowContents/Clock";
import {
  defaultColorWindowData,
  type ColorWindowData,
} from "../windowContents/Color";
import {
  defaultEmptyWindowData,
  type EmptyWindowData,
} from "../windowContents/Empty";
import {
  defaultNoteWindowData,
  type NoteWindowData,
} from "../windowContents/Note";

import { useWindow } from "./Windows";

export const windowContentsMap = {
  clock: lazy(async () => await import("../windowContents/Clock")),
  color: lazy(async () => await import("../windowContents/Color")),
  empty: lazy(async () => await import("../windowContents/Empty")),
  note: lazy(async () => await import("../windowContents/Note")),
};

export type WindowType = keyof typeof windowContentsMap;

export interface WindowData {
  type: WindowType;
  option?: unknown;
}

export const defaultWindowData: Record<WindowType, WindowData> = {
  clock: defaultClockWindowData,
  color: defaultColorWindowData,
  empty: defaultEmptyWindowData,
  note: defaultNoteWindowData,
};

export type WindowDataConcrete =
  | ClockWindowData
  | ColorWindowData
  | EmptyWindowData
  | NoteWindowData;

const WindowContent: Component = () => {
  const [state] = useWindow();
  return <Dynamic component={windowContentsMap[state.type]} />;
};

export default WindowContent;
