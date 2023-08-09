import OBSWebSocket from "obs-websocket-js";
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

export type ControllerContextValue = ResourceReturn<OBSWebSocket>;

const ControllerContext = createContext<ControllerContextValue>();

export const ControllerProvider: ParentComponent = (props) => {
  const obsResource = createResource(async () => await connect());

  return (
    <ControllerContext.Provider value={obsResource}>
      {props.children}
    </ControllerContext.Provider>
  );
};

export const useController = () => useContext(ControllerContext);
