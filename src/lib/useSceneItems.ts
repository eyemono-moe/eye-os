import { type Resource, createResource } from "solid-js";

import { useObsWebSocket } from "../contexts/useObsWebSocket";

import type OBSWebSocket from "obs-websocket-js";

const {
  obsResource: [obs],
} = useObsWebSocket();

const useSceneItems = (sceneName: string) => {
  const getSceneItems = async (_r: Resource<OBSWebSocket>) => {
    if (obs.state !== "ready") throw new Error("OBS is not ready");
    const res = await obs().call("GetSceneItemList", {
      sceneName,
    });
    return res.sceneItems;
  };

  const [sceneItems] = createResource(obs, getSceneItems);

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
