import { createResource } from "solid-js";

import { useObsWebSocket } from "../contexts/useObsWebSocket";

import { logger } from "./useLog";

import type { JsonObject } from "type-fest";

const { globalOBSWebsocket, obsConnected } = useObsWebSocket();

const useSceneItemTransform = (
  sceneName: string,
  sceneItemId: () => number,
) => {
  const getSceneItemTransform = async (data: {
    id: number;
    obsConnected: boolean;
  }) => {
    if (!data.obsConnected) {
      logger.error("OBS is not connected, cannot get scene item transform");
      throw new Error("OBS is not connected, cannot get scene item transform");
    }
    try {
      const res = await globalOBSWebsocket.call("GetSceneItemTransform", {
        sceneName,
        sceneItemId: data.id,
      });
      logger.log("Got scene item transform");
      return res.sceneItemTransform;
    } catch (e) {
      logger.error("Failed to get scene item transform: ", e);
      return {};
    }
  };

  const [transform, { refetch }] = createResource(
    () => ({
      id: sceneItemId(),
      obsConnected: obsConnected.state === "ready" && obsConnected(),
    }),
    getSceneItemTransform,
  );

  const setTransform = async (transform: JsonObject) => {
    if (obsConnected() !== true) {
      logger.error("OBS is not connected, cannot set scene item transform");
      return;
    }
    try {
      await globalOBSWebsocket.call("SetSceneItemTransform", {
        sceneName,
        sceneItemId: sceneItemId(),
        sceneItemTransform: transform,
      });
    } catch (e) {
      logger.error("Failed to set scene item transform:", e);
      console.error(e);
    }
  };

  return { transform, setTransform, refetch };
};

export default useSceneItemTransform;
