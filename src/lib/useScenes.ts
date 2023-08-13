import { createResource } from "solid-js";

import { useObsWebSocket } from "../contexts/useObsWebSocket";

import { logger } from "./useLog";

const { globalOBSWebsocket, obsConnected } = useObsWebSocket();

interface OBSScene {
  sceneIndex: number;
  sceneName: string;
}

const getScenes = async (): Promise<OBSScene[]> => {
  if (obsConnected() !== true) {
    logger.error("OBS is not connected, cannot get scenes");
    return [];
  }
  try {
    const res = await globalOBSWebsocket.call("GetSceneList");
    logger.log("Got scenes");
    return res.scenes as unknown as OBSScene[];
  } catch (e) {
    logger.error("Failed to get scenes:", e);
    return [];
  }
};

const [globalOBSScenes, { refetch }] = createResource(
  () => obsConnected.state === "ready" && obsConnected(),
  getScenes,
);

// eslint-disable-next-line @typescript-eslint/no-misused-promises
globalOBSWebsocket.on("SceneCreated", async () => {
  logger.log("OBS Scene created");
  await refetch();
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
globalOBSWebsocket.on("SceneRemoved", async () => {
  logger.log("OBS Scene removed");
  await refetch();
});

const changeScene = async (sceneName: string) => {
  if (obsConnected() !== true) {
    logger.error("OBS is not connected, cannot change scene");
    return;
  }
  try {
    // await globalOBSWebsocket.call()
  } catch (e) {
    logger.error("Failed to change scene:", e);
    console.error(e);
  }
};

const useScenes = () => {
  return { globalOBSScenes, changeScene };
};

export default useScenes;
