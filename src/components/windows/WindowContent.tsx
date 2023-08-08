import { lazy, type Component, ErrorBoundary } from "solid-js";
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
  type ControllerWindowData,
  defaultControllerWindowData,
} from "../windowContents/Controller";
import {
  defaultEmptyWindowData,
  type EmptyWindowData,
} from "../windowContents/Empty";
import {
  defaultNoteWindowData,
  type NoteWindowData,
} from "../windowContents/Note";

import ErrorScreen from "./ErrorScreen";
import { useWindow } from "./Windows";

export const windowContentsMap = {
  clock: lazy(async () => await import("../windowContents/Clock")),
  color: lazy(async () => await import("../windowContents/Color")),
  controller: lazy(async () => await import("../windowContents/Controller")),
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
  controller: defaultControllerWindowData,
  empty: defaultEmptyWindowData,
  note: defaultNoteWindowData,
};

export type WindowDataConcrete =
  | ClockWindowData
  | ColorWindowData
  | ControllerWindowData
  | EmptyWindowData
  | NoteWindowData;

const WindowContent: Component = () => {
  const [state] = useWindow();
  return (
    <ErrorBoundary fallback={(err) => <ErrorScreen message={err} />}>
      {/* <Suspense fallback={<LoadingScreen />}> */}
        <Dynamic component={windowContentsMap[state.type]} />
      {/* </Suspense> */}
    </ErrorBoundary>
  );
};

export default WindowContent;
