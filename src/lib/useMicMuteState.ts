import { createResource } from "solid-js";

import type OBSWebSocket from "obs-websocket-js";

const MIC_INPUT_NAME = "マイク";

const useMicMuteState = (obs: OBSWebSocket) => {
  const getMicMuted = async (): Promise<boolean> => {
    const res = await obs.call("GetInputMute", {
      inputName: MIC_INPUT_NAME,
    });
    if (res == null) {
      throw new Error("Failed to get mic mute status");
    }
    return res.inputMuted;
  };

  const [isMuted, { refetch, mutate }] = createResource(getMicMuted);

  const toggleMicMute = async () => {
    const res = await obs.call("ToggleInputMute", {
      inputName: MIC_INPUT_NAME,
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
    if (data.inputName === MIC_INPUT_NAME) {
      mutate(data.inputMuted);
    }
  };

  obs.on("InputMuteStateChanged", handleInputMuteStateChanged);

  return { isMuted, toggleMicMute };
};

export default useMicMuteState;
