import OBSWebSocket from "obs-websocket-js";
import {
  type ParentComponent,
  createContext,
  createResource,
  type ResourceReturn,
  useContext,
} from "solid-js";

const MIC_INPUT_NAME = "マイク";

const connect = async () => {
  console.log("Connecting to OBS WebSocket");
  const obs = new OBSWebSocket();
  try {
    const { obsWebSocketVersion, negotiatedRpcVersion } = await obs.connect(
      "ws://127.0.0.1:4455",
      "9768oIJoX4OUlvnW",
      {
        rpcVersion: 1,
      },
    );
    console.log(
      `Connected to server ${obsWebSocketVersion} (using RPC ${negotiatedRpcVersion})`,
    );
  } catch (error) {
    console.error("Failed to connect");
    console.error(error);
  }
  return obs;
};

export type ControllerContextValue = [
  obs: ResourceReturn<OBSWebSocket>,
  actions: {
    getMicMuted: () => Promise<boolean>;
    toggleMicMute: () => Promise<boolean>;
  },
];

const ControllerContext = createContext<ControllerContextValue>([
  createResource(async () => await connect()),
  {
    getMicMuted: async () => false,
    toggleMicMute: async () => false,
  },
]);

export const ControllerProvider: ParentComponent = (props) => {
  const [obs, actions] = createResource(async () => await connect());

  const getMicMuted = async (): Promise<boolean> => {
    const res = await obs()?.call("GetInputMute", {
      inputName: MIC_INPUT_NAME,
    });
    if (res == null) {
      throw new Error("Failed to get mic mute status");
    }
    return res.inputMuted;
  };

  const toggleMicMute = async (): Promise<boolean> => {
    const res = await obs()?.call("ToggleInputMute", {
      inputName: MIC_INPUT_NAME,
    });
    if (res == null) {
      throw new Error("Failed to toggle mic mute");
    }
    return res.inputMuted;
  };

  return (
    <ControllerContext.Provider
      value={[
        [obs, actions],
        {
          getMicMuted,
          toggleMicMute,
        },
      ]}
    >
      {props.children}
    </ControllerContext.Provider>
  );
};

export const useController = () => useContext(ControllerContext);
