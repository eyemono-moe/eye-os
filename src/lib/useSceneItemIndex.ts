import { createResource } from "solid-js";

import type OBSWebSocket from "obs-websocket-js";

const useSceneItemIndex = (obs: OBSWebSocket, sceneName: string) => {
  return (sceneItemId: () => number) => {
    const getSceneItemIndex = async (id: number) => {
      const res = await obs.call("GetSceneItemIndex", {
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
      await obs.call("SetSceneItemIndex", {
        sceneName,
        sceneItemId: sceneItemId(),
        sceneItemIndex: index,
      });
    };

    return { sceneItemIndex, setIndex, refetch };
  };
};

export default useSceneItemIndex;
