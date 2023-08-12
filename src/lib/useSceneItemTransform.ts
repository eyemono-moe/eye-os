import { createEffect, createResource, type Resource } from "solid-js";

import { useObsWebSocket } from "../contexts/useObsWebSocket";

import { logger } from "./useLog";

import type OBSWebSocket from "obs-websocket-js";
import type { JsonObject } from "type-fest";

const {
  obsResource: [obs],
} = useObsWebSocket();

const useSceneItemTransform = (
  sceneName: string,
  sceneItemId: () => number,
) => {
  const getSceneItemTransform = async (_r: Resource<OBSWebSocket>) => {
    if (obs.state !== "ready") throw new Error("OBS is not ready");
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const res = await obs().call("GetSceneItemTransform", {
      sceneName,
      sceneItemId: sceneItemId(),
    });
    return res.sceneItemTransform;
  };

  const [transform, { refetch }] = createResource(obs, getSceneItemTransform);

  createEffect(async () => {
    void sceneItemId();
    await refetch();
  });

  const setTransform = async (transform: JsonObject) => {
    if (obs.state !== "ready") {
      logger.error("OBS is not ready");
      return;
    }

    await obs().call("SetSceneItemTransform", {
      sceneName,
      sceneItemId: sceneItemId(),
      sceneItemTransform: transform,
    });
  };

  return { transform, setTransform, refetch };
};

export default useSceneItemTransform;
