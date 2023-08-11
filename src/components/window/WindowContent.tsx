import { type Component, ErrorBoundary } from "solid-js";
import { Dynamic } from "solid-js/web";

import Clock, {
  defaultClockWindowData,
  type ClockWindowData,
} from "../windowContents/Clock";
import Color, {
  defaultColorWindowData,
  type ColorWindowData,
} from "../windowContents/Color";
import Controller, {
  type ControllerWindowData,
  defaultControllerWindowData,
} from "../windowContents/Controller";
import Empty, {
  defaultEmptyWindowData,
  type EmptyWindowData,
} from "../windowContents/Empty";
import Log, {
  type LogWindowData,
  defaultLogWindowData,
} from "../windowContents/Log";
import Note, {
  defaultNoteWindowData,
  type NoteWindowData,
} from "../windowContents/Note";
import { useWindow } from "../Windows";

import ErrorScreen from "./ErrorScreen";

export const windowContentsMap = {
  clock: Clock,
  color: Color,
  controller: Controller,
  empty: Empty,
  log: Log,
  note: Note,
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
  log: defaultLogWindowData,
  note: defaultNoteWindowData,
};

export type WindowDataConcrete =
  | ClockWindowData
  | ColorWindowData
  | ControllerWindowData
  | EmptyWindowData
  | LogWindowData
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
