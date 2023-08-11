import { createResource } from "solid-js";

import type OBSWebSocket from "obs-websocket-js";

const useMicMuteState = (obs: OBSWebSocket, inputName: string = "マイク") => {
  const getInputMuted = async (): Promise<boolean> => {
    const res = await obs.call("GetInputMute", {
      inputName,
    });
    return res.inputMuted;
  };

  const [isMuted, { refetch, mutate }] = createResource(getInputMuted);

  const toggleMute = async () => {
    const res = await obs.call("ToggleInputMute", {
      inputName,
    });
    if (res == null) {
      throw new Error("Failed to toggle mic mute");
    }
    await refetch();
  };

  const handleInputMuteStateChanged = (data: {
    inputName: string;
    inputMuted: boolean;
  }) => {
    if (data.inputName === inputName) {
      mutate(data.inputMuted);
    }
  };

  obs.on("InputMuteStateChanged", handleInputMuteStateChanged);

  return { isMuted, toggleMute };
};

export default useMicMuteState;
