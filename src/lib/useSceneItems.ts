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

  const [sceneItems, { refetch, mutate }] = createResource(getSceneItems);

  obs.on("SceneItemCreated", (data) => {
    console.log("SceneItemCreated", data);
    if (sceneItems.state === "ready") {
      mutate(sceneItems().concat(data));
    }
  });

  obs.on("SceneItemRemoved", (data) => {
    console.log("SceneItemRemoved", data);
    if (sceneItems.state === "ready") {
      mutate(
        sceneItems().filter((item) => item.sceneItemId !== data.sceneItemId),
      );
    }
  });

  obs.on("SceneItemListReindexed", (data) => {
    console.log("SceneItemListReindexed", data);
    // if (sceneItems.state === "ready") {
    //   mutate(sceneItems().filter((item) => item.sceneItemId !== data.sceneItemId));
    // }
  });

  return { sceneItems };
};

export default useSceneItems;
