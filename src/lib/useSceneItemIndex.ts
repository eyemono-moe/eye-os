import { createResource } from "solid-js";

import { useObsWebSocket } from "../contexts/useObsWebSocket";

import { logger } from "./useLog";

const {
  obsResource: [obs],
} = useObsWebSocket();

const useSceneItemIndex = (sceneName: string, sceneItemId: () => number) => {
  const getSceneItemIndex = async (id: number) => {
    if (obs.state !== "ready") throw new Error("OBS is not ready");
    const res = await obs().call("GetSceneItemIndex", {
      sceneName,
      sceneItemId: id,
    });
    return res.sceneItemIndex;
  };

  const [sceneItemIndex, { refetch }] = createResource(
    sceneItemId,
    getSceneItemIndex,
  );

  const setIndex = async (index: number) => {
    if (obs.state !== "ready") {
      logger.error("OBS is not ready");
      return;
    }

    await obs().call("SetSceneItemIndex", {
      sceneName,
      sceneItemId: sceneItemId(),
      sceneItemIndex: index,
    });
  };

  return { sceneItemIndex, setIndex, refetch };
};

export default useSceneItemIndex;
