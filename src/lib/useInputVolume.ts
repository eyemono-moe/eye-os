import { createResource } from "solid-js";

import type OBSWebSocket from "obs-websocket-js";

const useInputVolume = (obs: OBSWebSocket, inputName: string = "マイク") => {
  const getInputVolume = async (): Promise<number> => {
    const res = await obs.call("GetInputVolume", {
      inputName,
    });
    return res.inputVolumeDb;
  };

  const [volume, { refetch, mutate }] = createResource(getInputVolume);

  const setVolume = async (volumeDb: number) => {
    const inputVolumeDb = Math.max(-100, Math.min(26, volumeDb));
    await obs.call("SetInputVolume", {
      inputName,
      inputVolumeDb,
    });
    await refetch();
  };

  const handleInputVolumeChanged = (data: {
    inputName: string;
    inputVolumeMul: number;
    inputVolumeDb: number;
  }) => {
    if (data.inputName === inputName) {
      mutate(data.inputVolumeDb);
    }
  };

  obs.on("InputVolumeChanged", handleInputVolumeChanged);

  return { volume, setVolume };
};

export default useInputVolume;
