import { createContext, useContext, type ParentComponent } from "solid-js";
import { produce, type SetStoreFunction } from "solid-js/store";

import { type WindowDataConcrete } from "../components/windows/WindowContent";
import { createLocalStore } from "../lib/createLocalStore";

export interface Position {
  x: number;
  y: number;
}

export type WindowInfo = {
  title: string;
  icon: string;
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
      title: "Game",
      icon: "🎮",
      topLeft: {
        x: 16,
        y: 16,
      },
      bottomRight: {
        x: 1416,
        y: 803,
      },
      color: "#db33ea",
      minimized: false,
      type: "color",
      option: {
        color: "#0000ff",
      },
      zIndex: 1,
    },
    {
      title: "Clock",
      icon: "🕑",
      topLeft: {
        x: 1503,
        y: 19.5,
      },
      bottomRight: {
        x: 1890,
        y: 194.5,
      },
      color: "#da33eb",
      minimized: false,
      type: "clock",
      zIndex: 0,
    },
    {
      title: "Comments",
      icon: "💬",
      topLeft: {
        x: 1443,
        y: 210,
      },
      bottomRight: {
        x: 1889,
        y: 682,
      },
      color: "#f133ca",
      minimized: false,
      type: "color",
      zIndex: 0,
      option: {
        color: "#0000ff",
      },
    },
    {
      title: "Info",
      icon: "ℹ️",
      topLeft: {
        x: 470,
        y: 825,
      },
      bottomRight: {
        x: 931,
        y: 1014,
      },
      color: "#f233ca",
      minimized: false,
      type: "note",
      option: {
        content: "- Twetter:@eyemono_moe\n- hashtag:#四十物さんは見ている",
        alignment: "left",
        fontSize: 24,
      },
      zIndex: 5,
    },
    {
      title: "Note",
      icon: "📝",
      minimized: false,
      zIndex: 4,
      topLeft: {
        x: 928,
        y: 744,
      },
      bottomRight: {
        x: 1497,
        y: 1031,
      },
      color: "#e133e1",
      type: "empty",
    },
    {
      title: "Icon.svg",
      icon: "😃",
      minimized: false,
      zIndex: 3,
      topLeft: {
        x: 1502,
        y: 670,
      },
      bottomRight: {
        x: 1861,
        y: 1054,
      },
      color: "#de33e5",
      type: "color",
      option: {
        color: "#0000ff",
      },
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
