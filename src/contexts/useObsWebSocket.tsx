import OBSWebSocket, { EventSubscription } from "obs-websocket-js";
import {
  type ParentComponent,
  createContext,
  createResource,
  type ResourceReturn,
  useContext,
  Show,
} from "solid-js";

import { logger } from "../lib/useLog";

import { useGlobalConfig } from "./useGlobalConfig";

const connect = async (option: { address: string; password: string }) => {
  logger.log("Connecting to OBS WebSocket");
  const obs = new OBSWebSocket();
  try {
    const { obsWebSocketVersion, negotiatedRpcVersion } = await obs.connect(
      option.address,
      option.password,
      {
        rpcVersion: 1,
        eventSubscriptions: EventSubscription.All,
        // eventSubscriptions: EventSubscription.All | EventSubscription.SceneItemTransformChanged,
      },
    );
    logger.log(
      `Connected to server ${obsWebSocketVersion} (using RPC ${negotiatedRpcVersion})`,
    );
  } catch (error) {
    logger.error("Failed to connect");
  }
  return obs;
};

export type ObsWebSocketContextValue = ResourceReturn<OBSWebSocket>;

const ObsWebSocketContext = createContext<ObsWebSocketContextValue>();

export const ObsWebSocketProvider: ParentComponent = (props) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const [config] = useGlobalConfig()!;
  const [obs, actions] = createResource(
    () => ({ address: config.obs.address, password: config.obs.password }),
    connect,
  );

  return (
    <ObsWebSocketContext.Provider value={[obs, actions]}>
      <Show when={obs.state === "ready"}>{props.children}</Show>
    </ObsWebSocketContext.Provider>
  );
};

export const useObsWebSocket = () => useContext(ObsWebSocketContext);
