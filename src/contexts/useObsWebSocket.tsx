import OBSWebSocket, { EventSubscription } from "obs-websocket-js";
import {
  type ParentComponent,
  createContext,
  createResource,
  type ResourceReturn,
  useContext,
} from "solid-js";

import { logger } from "../lib/useLog";

const connect = async () => {
  logger.log("Connecting to OBS WebSocket");
  const obs = new OBSWebSocket();
  try {
    const { obsWebSocketVersion, negotiatedRpcVersion } = await obs.connect(
      "ws://127.0.0.1:4455",
      "9768oIJoX4OUlvnW",
      {
        rpcVersion: 1,
        eventSubscriptions:
          EventSubscription.All | EventSubscription.SceneItemTransformChanged,
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
  const obsResource = createResource(async () => await connect());

  return (
    <ObsWebSocketContext.Provider value={obsResource}>
      {props.children}
    </ObsWebSocketContext.Provider>
  );
};

export const useObsWebSocket = () => useContext(ObsWebSocketContext);
