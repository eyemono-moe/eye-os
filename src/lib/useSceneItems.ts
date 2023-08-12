import { type Resource, createResource, createEffect } from "solid-js";

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

  const [sceneItems, { refetch }] = createResource(obs, getSceneItems);

  createEffect(() => {
    if (obs.state !== "ready") return;
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    obs().on("SceneItemCreated", async (_data) => {
      await refetch();
    });

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    obs().on("SceneItemRemoved", async (_data) => {
      await refetch();
    });
  });

  return { sceneItems };
};

export default useSceneItems;
