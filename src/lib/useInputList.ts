import { createResource } from "solid-js";

import { useObsWebSocket } from "../contexts/useObsWebSocket";

import { logger } from "./useLog";

const { globalOBSWebsocket, obsConnected } = useObsWebSocket();

interface Input {
  inputKind: string;
  inputName: string;
  unversionedInputKind: string;
}

const getInputs = async (): Promise<Input[]> => {
  if (obsConnected() !== true) {
    logger.error("OBS is not connected, cannot get inputs");
    return [];
  }
  try {
    const res = await globalOBSWebsocket.call("GetInputList");
    logger.log("Got inputs");
    return (res.inputs as unknown as Input[]).filter((input) =>
      input.inputKind.startsWith("wasapi"),
    );
  } catch (e) {
    logger.error("Failed to get inputs:", e);
    return [];
  }
};

const [globalOBSInputs, { refetch }] = createResource(
  () => obsConnected.state === "ready",
  getInputs,
);

// eslint-disable-next-line @typescript-eslint/no-misused-promises
globalOBSWebsocket.on("InputCreated", async () => {
  logger.log("OBS Input added");
  await refetch();
});
// eslint-disable-next-line @typescript-eslint/no-misused-promises
globalOBSWebsocket.on("InputRemoved", async () => {
  logger.log("OBS Input added");
  await refetch();
});
// eslint-disable-next-line @typescript-eslint/no-misused-promises
globalOBSWebsocket.on("InputNameChanged", async () => {
  logger.log("OBS Input added");
  await refetch();
});

const useInputList = () => {
  return { globalOBSInputs };
};

export default useInputList;
