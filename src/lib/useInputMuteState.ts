import { type Accessor, createResource } from "solid-js";

import { useObsWebSocket } from "../contexts/useObsWebSocket";

import { logger } from "./useLog";
const { globalOBSWebsocket, obsConnected } = useObsWebSocket();
const useMicMuteState = (inputName: Accessor<string>) => {
  const getInputMuted = async (): Promise<boolean> => {
    const res = await globalOBSWebsocket.call("GetInputMute", {
      inputName: inputName(),
    });
    return res.inputMuted;
  };

  const [isMuted, { mutate }] = createResource(getInputMuted);

  const toggleMute = async () => {
    if (obsConnected() !== true) {
      logger.error("OBS is not connected, cannot set scene item index");
      return;
    }
    try {
      const res = await globalOBSWebsocket.call("ToggleInputMute", {
        inputName: inputName(),
      });
      mutate(res.inputMuted);
    } catch (e) {
      logger.error("Failed to set scene item index:", e);
      console.error(e);
    }
  };

  const handleInputMuteStateChanged = (data: {
    inputName: string;
    inputMuted: boolean;
  }) => {
    if (data.inputName === inputName()) {
      mutate(data.inputMuted);
    }
  };

  globalOBSWebsocket.on("InputMuteStateChanged", handleInputMuteStateChanged);

  return { isMuted, toggleMute };
};

export default useMicMuteState;
