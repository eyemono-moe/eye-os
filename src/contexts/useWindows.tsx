import { createContext, useContext, type ParentComponent } from "solid-js";
import { type SetStoreFunction } from "solid-js/store";

import { type WindowContentProps } from "../components/WindowContent";
import { createLocalStore } from "../lib/createLocalStore";
import { semanticColors } from "../theme/color";

export interface Position {
  x: number;
  y: number;
}

export interface WindowInfo {
  title: string;
  topLeft: Position;
  bottomRight: Position;
  color: string;
  minimized: boolean;
  type: WindowContentProps["type"];
}

export interface WindowsContextState {
  windows: WindowInfo[];
}

export type ThemeContextValue = [
  state: WindowsContextState,
  actions: {
    setState: SetStoreFunction<WindowsContextState>;
  },
];

const defaultState: WindowsContextState = {
  windows: [
    {
      title: "test1",
      topLeft: { x: 100, y: 100 },
      bottomRight: { x: 500, y: 500 },
      color: semanticColors.accent.primary,
      minimized: false,
      type: "default",
    },
    {
      title: "test2",
      topLeft: { x: 200, y: 150 },
      bottomRight: { x: 600, y: 550 },
      color: semanticColors.accent.tertiary,
      minimized: false,
      type: "clock",
    },
  ],
};

const WindowsContext = createContext<ThemeContextValue>([
  defaultState,
  {
    setState: () => {},
  },
]);

export const WindowsProvider: ParentComponent = (props) => {
  const [state, setState] = createLocalStore("windows", defaultState);

  return (
    <WindowsContext.Provider value={[state, { setState }]}>
      {props.children}
    </WindowsContext.Provider>
  );
};

export const useWindows = () => useContext(WindowsContext);
