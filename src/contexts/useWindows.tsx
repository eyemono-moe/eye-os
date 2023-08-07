import { createContext, useContext, type ParentComponent } from "solid-js";
import { produce, type SetStoreFunction } from "solid-js/store";

import { type WindowDataConcrete } from "../components/windows/WindowContent";
import { createLocalStore } from "../lib/createLocalStore";
import generateWindowColor from "../lib/generateWindowColor";

export interface Position {
  x: number;
  y: number;
}

export type WindowInfo = {
  title: string;
  topLeft: Position;
  bottomRight: Position;
  color: string;
  minimized: boolean;
  zIndex: number;
} & WindowDataConcrete;

export interface WindowsContextState {
  windows: WindowInfo[];
}

export type WindowsContextValue = [
  state: WindowsContextState,
  actions: {
    setState: SetStoreFunction<WindowsContextState>;
    setTop: (index: number) => void;
    resetDisplay: () => void;
    addWindow: (windowInfo: WindowInfo) => void;
    removeWindow: (index: number) => void;
  },
];

const defaultState: WindowsContextState = {
  windows: [
    {
      title: "🎮 Game",
      topLeft: {
        x: 16,
        y: 16,
      },
      bottomRight: {
        x: 1107,
        y: 708,
      },
      color: generateWindowColor(),
      minimized: false,
      type: "color",
      option: {
        color: "#0000ff",
      },
      zIndex: 0,
    },
    {
      title: "🕑 Clock",
      topLeft: {
        x: 1128,
        y: 16,
      },
      bottomRight: {
        x: 1423,
        y: 132,
      },
      color: generateWindowColor(),
      minimized: false,
      type: "clock",
      zIndex: 0,
    },
    {
      title: "🗨️ Comments",
      topLeft: {
        x: 1143,
        y: 136,
      },
      bottomRight: {
        x: 1422,
        y: 787,
      },
      color: generateWindowColor(),
      minimized: false,
      type: "empty",
      zIndex: 0,
    },
    {
      title: "📝 Notes",
      topLeft: {
        x: 483,
        y: 717,
      },
      bottomRight: {
        x: 1131,
        y: 951,
      },
      color: generateWindowColor(),
      minimized: false,
      type: "note",
      option: {
        content: "Hello, World!",
        alignment: "left",
        fontSize: 24,
      },
      zIndex: 0,
    },
  ],
};

const WindowsContext = createContext<WindowsContextValue>([
  defaultState,
  {
    setState: () => {},
    setTop: () => {},
    resetDisplay: () => {},
    addWindow: () => {},
    removeWindow: () => {},
  },
]);

export const WindowsProvider: ParentComponent = (props) => {
  const [state, setState] = createLocalStore("windows", defaultState);

  const setTop = (index: number) => {
    // すでに最前面なら何もしない
    if (state.windows[index].zIndex === state.windows.length - 1) return;

    for (let i = 0; i < state.windows.length; i++) {
      if (i === index) {
        setState("windows", i, "zIndex", state.windows.length - 1);
      } else {
        setState("windows", i, "zIndex", (z) => Math.max(0, z - 1));
      }
    }
  };
  const resetDisplay = () => {
    setState("windows", defaultState.windows);
  };
  const addWindow = (windowInfo: WindowInfo) => {
    setState(
      produce((store) => {
        store.windows.push(windowInfo);
      }),
    );
  };
  const removeWindow = (index: number) => {
    setState(
      "windows",
      produce((windows) => {
        windows.splice(index, 1);
        return windows;
      }),
    );
  };

  return (
    <WindowsContext.Provider
      value={[
        state,
        { setState, setTop, resetDisplay, addWindow, removeWindow },
      ]}
    >
      {props.children}
    </WindowsContext.Provider>
  );
};

export const useWindows = () => useContext(WindowsContext);
