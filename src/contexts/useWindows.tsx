import { createContext, useContext, type ParentComponent } from "solid-js";
import { produce, type SetStoreFunction } from "solid-js/store";

import { type WindowDataConcrete } from "../components/windows/WindowContent";
import { createLocalStore } from "../lib/createLocalStore";

export type WindowInfo = {
  title: string;
  icon: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  minimized: boolean;
  zIndex: number;
  linkSceneItemId?: number;
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
      x: 16,
      y: 16,
      width: 1600,
      height: 900,
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
      x: 1500,
      y: 20,
      width: 300,
      height: 160,
      color: "#da33eb",
      minimized: false,
      type: "clock",
      zIndex: 0,
    },
    {
      title: "Comments",
      icon: "💬",
      x: 1443,
      y: 210,
      width: 400,
      height: 400,
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
      x: 470,
      y: 825,
      width: 500,
      height: 200,
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
      x: 928,
      y: 744,
      width: 500,
      height: 300,
      color: "#e133e1",
      type: "note",
      option: {
        alignment: "center",
        content: "",
        fontSize: 24,
      },
    },
    {
      title: "Icon.svg",
      icon: "😃",
      minimized: false,
      zIndex: 3,
      x: 1502,
      y: 670,
      width: 300,
      height: 300,
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
