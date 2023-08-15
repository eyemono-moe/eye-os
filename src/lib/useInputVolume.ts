import { type Accessor, createResource } from "solid-js";

import { useObsWebSocket } from "../contexts/useObsWebSocket";

const { globalOBSWebsocket } = useObsWebSocket();

const useInputVolume = (inputName: Accessor<string>) => {
  const getInputVolume = async (): Promise<number> => {
    const res = await globalOBSWebsocket.call("GetInputVolume", {
      inputName: inputName(),
    });
    return res.inputVolumeDb;
  };

  const [volume, { refetch, mutate }] = createResource(getInputVolume);

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
