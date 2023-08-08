import OBSWebSocket from "obs-websocket-js";
import {
  type ParentComponent,
  createContext,
  createResource,
  type ResourceReturn,
  useContext,
} from "solid-js";

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

export type ControllerContextValue = ResourceReturn<OBSWebSocket>;

const ControllerContext = createContext<ControllerContextValue>(
  createResource(async () => await connect()),
);

export const ControllerProvider: ParentComponent = (props) => {
  const obsResource = createResource(async () => await connect());

  return (
    <ControllerContext.Provider value={obsResource}>
      {props.children}
    </ControllerContext.Provider>
  );
};

export const useController = () => useContext(ControllerContext);
