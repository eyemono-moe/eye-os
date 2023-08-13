import OBSWebSocket, { EventSubscription } from "obs-websocket-js";
import { createResource } from "solid-js";

import { createLocalStore } from "../lib/createLocalStore";
import { logger } from "../lib/useLog";

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

const [obsConfig, setObsConfig] = createLocalStore<{
  address: string;
  password: string;
}>("obsConfig", {
  address: "ws://localhost:4455",
  password: "",
});
const obsResource = createResource(
  () => ({ address: obsConfig.address, password: obsConfig.password }),
  connect,
);

export const useObsWebSocket = () => ({
  obsResource,
  obsConfig,
  actions: {
    setObsConfig,
  },
});
