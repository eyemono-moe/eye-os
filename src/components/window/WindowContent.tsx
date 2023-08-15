import { type Component, ErrorBoundary } from "solid-js";
import { Dynamic } from "solid-js/web";

import Color, {
  defaultColorWindowData,
  type ColorWindowData,
} from "../windowContents/Color";
import Empty, {
  defaultEmptyWindowData,
  type EmptyWindowData,
} from "../windowContents/Empty";
import InputController, {
  type InputControllerWindowData,
  defaultINputControllerWindowData,
} from "../windowContents/InputController";
import Log, {
  type LogWindowData,
  defaultLogWindowData,
} from "../windowContents/Log";
import Note, {
  defaultNoteWindowData,
  type NoteWindowData,
} from "../windowContents/Note";
import Stopwatch, {
  defaultStopwatchWindowData,
  type StopwatchWindowData,
} from "../windowContents/Stopwatch";
import { useWindow } from "../Windows";

import ErrorScreen from "./ErrorScreen";

export const windowContentsMap = {
  color: Color,
  inputController: InputController,
  empty: Empty,
  log: Log,
  note: Note,
  stopwatch: Stopwatch,
};

export type WindowType = keyof typeof windowContentsMap;

export interface WindowData {
  type: WindowType;
  option?: unknown;
}

export const defaultWindowData: Record<WindowType, WindowData> = {
  color: defaultColorWindowData,
  inputController: defaultINputControllerWindowData,
  empty: defaultEmptyWindowData,
  log: defaultLogWindowData,
  note: defaultNoteWindowData,
  stopwatch: defaultStopwatchWindowData,
};

export type WindowDataConcrete =
  | ColorWindowData
  | InputControllerWindowData
  | EmptyWindowData
  | LogWindowData
  | NoteWindowData
  | StopwatchWindowData;

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
