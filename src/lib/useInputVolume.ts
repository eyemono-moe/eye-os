import { type Accessor, createResource } from "solid-js";

import { useObsWebSocket } from "../contexts/useObsWebSocket";

import { logger } from "./useLog";

const { globalOBSWebsocket, obsConnected } = useObsWebSocket();

/**
 * Hook to get and set the volume of an OBS input
 *
 * @param inputName The name of the input to get/set the volume of
 * @returns An object containing the current volume and a function to set the volume
 */
const useInputVolume = (inputName: Accessor<string>) => {
  const getInputVolume = async (): Promise<number> => {
    if (obsConnected.state !== "ready" || !obsConnected()) {
      logger.error(`OBS not connected, cannot get ${inputName()} volume`);
      return 0;
    }
    try {
      const res = await globalOBSWebsocket.call("GetInputVolume", {
        inputName: inputName(),
      });
      return res.inputVolumeDb;
    } catch (e) {
      logger.error(`Error getting ${inputName()} volume:`, e);
      return 0;
    }
  };

  const [volume, { refetch, mutate }] = createResource(
    // update when obsConnected state changes
    () => obsConnected.state === "ready",
    getInputVolume,
  );

  const setVolume = async (volumeDb: number) => {
    const inputVolumeDb = Math.max(-100, Math.min(26, volumeDb));
    await globalOBSWebsocket.call("SetInputVolume", {
      inputName: inputName(),
      inputVolumeDb,
    });
    await refetch();
  };

  const handleInputVolumeChanged = (data: {
    inputName: string;
    inputVolumeMul: number;
    inputVolumeDb: number;
  }) => {
    if (data.inputName === inputName()) {
      mutate(data.inputVolumeDb);
    }
  };

  globalOBSWebsocket.on("InputVolumeChanged", handleInputVolumeChanged);

  return { volume, setVolume };
};

export default useInputVolume;
