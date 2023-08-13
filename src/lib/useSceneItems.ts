import { createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import { type JsonObject } from "type-fest";

import { useObsWebSocket } from "../contexts/useObsWebSocket";

import { logger } from "./useLog";
import useScenes from "./useScenes";

const { globalOBSWebsocket } = useObsWebSocket();
const { globalOBSScenes } = useScenes();

const [sceneItems, setSceneItems] = createStore<Record<string, JsonObject[]>>(
  {},
);

const reloadSceneItems = async () => {
  if (globalOBSScenes.state === "ready") {
    for (const scene of globalOBSScenes()) {
      try {
        const res = await globalOBSWebsocket.call("GetSceneItemList", {
          sceneName: scene.sceneName,
        });
        logger.log("Got scene items");
        setSceneItems(scene.sceneName, res.sceneItems);
      } catch (e) {
        logger.error("Failed to get scene items:", e);
      }
    }
  }
};

// eslint-disable-next-line solid/reactivity
createEffect(reloadSceneItems);

// eslint-disable-next-line @typescript-eslint/no-misused-promises
globalOBSWebsocket.on("SceneItemCreated", async (_) => {
  await reloadSceneItems();
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
globalOBSWebsocket.on("SceneItemRemoved", async (_) => {
  await reloadSceneItems();
});

const useSceneItems = () => {
  return { sceneItems };
};

export default useSceneItems;
