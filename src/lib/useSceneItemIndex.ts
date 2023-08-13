import { useGlobalConfig } from "../contexts/useGlobalConfig";
import { useObsWebSocket } from "../contexts/useObsWebSocket";

import { logger } from "./useLog";
import useSceneItems from "./useSceneItems";

const { globalOBSWebsocket, obsConnected } = useObsWebSocket();
const [config] = useGlobalConfig();
const { sceneItems } = useSceneItems();

const useSceneItemIndex = (sceneItemId: () => number) => {
  // const getSceneItemIndex = async (data: {
  //   id: number;
  //   obsConnected: Resource<boolean>;
  // }) => {
  //   if (obsConnected() !== true) {
  //     logger.error("OBS is not connected, cannot get scene item index");
  //     return {};
  //   }
  //   try {
  //     const res = await globalOBSWebsocket.call("GetSceneItemIndex", {
  //       sceneName,
  //       sceneItemId: data.id,
  //     });
  //     return res.sceneItemIndex;
  //   } catch (e) {
  //     logger.error("Failed to get scene item index");
  //     return {};
  //   }
  // };

  // const [sceneItemIndex, { refetch }] = createResource(
  //   () => ({
  //     id: sceneItemId(),
  //     obsConnected,
  //   }),
  //   getSceneItemIndex,
  // );

  const setIndex = async (index: number) => {
    if (obsConnected() !== true) {
      logger.error("OBS is not connected, cannot set scene item index");
      return;
    }
    try {
      await globalOBSWebsocket.call("SetSceneItemIndex", {
        sceneName: config.currentSceneName,
        sceneItemId: sceneItemId(),
        sceneItemIndex: index,
      });
    } catch (e) {
      logger.error("Failed to set scene item index:", e);
      console.error(e);
    }
  };

  const setTop = async () => {
    if (obsConnected() !== true) {
      logger.error("OBS is not connected, cannot set scene item index");
      return;
    }
    if (sceneItems[config.currentSceneName] === undefined) {
      logger.error("Cannot set top if there are no scene items");
      return;
    }
    if (sceneItems[config.currentSceneName]?.length < 2) {
      logger.error("Cannot set top if there is only one scene item");
      return;
    }
    try {
      await globalOBSWebsocket.call("SetSceneItemIndex", {
        sceneName: config.currentSceneName,
        sceneItemId: sceneItemId(),
        sceneItemIndex: sceneItems[config.currentSceneName].length - 2,
      });
    } catch (e) {
      logger.error("Failed to set scene item index:", e);
      console.error(e);
    }
  };

  return { setIndex, setTop };
};

export default useSceneItemIndex;
