import { createResource } from "solid-js";

import type OBSWebSocket from "obs-websocket-js";
import type { JsonObject } from "type-fest";

const useSceneItemTransform = (obs: OBSWebSocket, sceneName: string) => {
  return (sceneItemId: () => number) => {
    const getSceneItemTransform = async (id: number) => {
      const res = await obs.call("GetSceneItemTransform", {
        sceneName,
        sceneItemId: id,
      });
      if (res == null) {
        throw new Error("Failed to get mic mute status");
      }
      return res.sceneItemTransform;
    };

    const [transform, { mutate, refetch }] = createResource(
      sceneItemId,
      getSceneItemTransform,
    );

    // obs.on("SceneItemTransformChanged", (data) => {
    //   if (transform.state === "ready" && data.sceneItemId === sceneItemId()) {
    //     mutate(data.sceneItemTransform);
    //   }
    // });

    const setTransform = async (transform: JsonObject) => {
      await obs.call("SetSceneItemTransform", {
        sceneName,
        sceneItemId: sceneItemId(),
        sceneItemTransform: transform,
      });
    };

    return { transform, setTransform, refetch };
  };
};

export default useSceneItemTransform;
