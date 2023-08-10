import { type ParentComponent, createContext, useContext } from "solid-js";
import { type SetStoreFunction } from "solid-js/store";

import { createLocalStore } from "../lib/createLocalStore";

export interface GlobalConfig {
  obs: {
    address: string;
    password: string;
  };
}

export type GlobalConfigContextValue = [
  config: GlobalConfig,
  actions: {
    setConfig: SetStoreFunction<GlobalConfig>;
  },
];

export const GlobalConfigContext = createContext<GlobalConfigContextValue>();

export const GlobalConfigProvider: ParentComponent = (props) => {
  const [config, setConfig] = createLocalStore<GlobalConfig>("config", {
    obs: {
      address: "",
      password: "",
    },
  });

  return (
    <GlobalConfigContext.Provider value={[config, { setConfig }]}>
      {props.children}
    </GlobalConfigContext.Provider>
  );
};

export const useGlobalConfig = () => useContext(GlobalConfigContext);
