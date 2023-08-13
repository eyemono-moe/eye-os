import { type ParentComponent, createContext, useContext } from "solid-js";
import { type SetStoreFunction } from "solid-js/store";

import { createLocalStore } from "../lib/createLocalStore";

export interface GlobalConfig {
  currentSceneName: string;
}

export type GlobalConfigContextValue = [
  config: GlobalConfig,
  actions: {
    setConfig: SetStoreFunction<GlobalConfig>;
  },
];

const defaultState: GlobalConfig = {
  currentSceneName: "メイン画面",
};

export const GlobalConfigContext = createContext<GlobalConfigContextValue>([
  defaultState,
  {
    setConfig: () => {},
  },
]);

export const GlobalConfigProvider: ParentComponent = (props) => {
  const [config, setConfig] = createLocalStore<GlobalConfig>(
    "config",
    defaultState,
  );

  return (
    <GlobalConfigContext.Provider value={[config, { setConfig }]}>
      {props.children}
    </GlobalConfigContext.Provider>
  );
};

export const useGlobalConfig = () => useContext(GlobalConfigContext);
