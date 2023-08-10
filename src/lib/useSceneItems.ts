import { createResource } from "solid-js";

import type OBSWebSocket from "obs-websocket-js";

const useSceneItems = (obs: OBSWebSocket, sceneName: string) => {
  const getSceneItems = async () => {
    const res = await obs.call("GetSceneItemList", {
      sceneName,
    });
    if (res == null) {
      throw new Error("Failed to get mic mute status");
    }
    return res.sceneItems;
  };

  const [sceneItems] = createResource(getSceneItems);

  // obs.on("SceneItemCreated", (data) => {
  //   if (sceneItems.state === "ready") {
  //     mutate(sceneItems().concat(data));
  //   }
  // });

  // obs.on("SceneItemRemoved", (data) => {
  //   if (sceneItems.state === "ready") {
  //     mutate(
  //       sceneItems().filter((item) => item.sceneItemId !== data.sceneItemId),
  //     );
  //   }
  // });

  // obs.on("SceneItemListReindexed", (data) => {
  //   if (sceneItems.state === "ready") {
  //     mutate(sceneItems().filter((item) => item.sceneItemId !== data.sceneItemId));
  //   }
  // });

  return { sceneItems };
};

export default useSceneItems;
