import OBSWebSocket, { EventSubscription } from "obs-websocket-js";
import { createResource } from "solid-js";

import { createLocalStore } from "../lib/createLocalStore";
import { logger } from "../lib/useLog";

/** OBS WebSocketのインスタンス */
export const globalOBSWebsocket = new OBSWebSocket();

const [obsConfig, setObsConfig] = createLocalStore("obsConfig", {
  address: "ws://localhost:4455",
  password: "",
});

/**
 * OBS WebSocketに接続する
 *
 * @param config 接続先のアドレスとパスワード
 * @returns 接続に成功したかどうか
 */
const connect = async (data: { address: string; password: string }) => {
  logger.log("Connecting to OBS WebSocket...");

  // 既に接続済みの場合は一度切断する
  if (globalOBSWebsocket.identified) {
    logger.log("already connected, disconnecting...");
    await globalOBSWebsocket.disconnect();
  }

  try {
    const { obsWebSocketVersion, negotiatedRpcVersion } =
      await globalOBSWebsocket.connect(data.address, data.password, {
        rpcVersion: 1,
        eventSubscriptions: EventSubscription.All,
      });
    logger.log(
      `Connected to server ${obsWebSocketVersion} (using RPC ${negotiatedRpcVersion})`,
    );
  } catch (error) {
    logger.error("Failed to connect");
  }
  return globalOBSWebsocket.identified;
};

const [obsConnected, { refetch: refetchObs }] = createResource(
  () => ({
    address: obsConfig.address,
    password: obsConfig.password,
  }),
  connect,
);

export const useObsWebSocket = () => ({
  globalOBSWebsocket,
  obsConnected,
  obsConfig,
  actions: {
    refetchObs,
    setObsConfig,
  },
});
