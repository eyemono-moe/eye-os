import { styled } from "@macaron-css/solid";
import {
  FaSolidMicrophone,
  FaSolidMicrophoneSlash,
  FaSolidArrowRotateRight,
} from "solid-icons/fa";
import { Show, type Component, type ResourceActions } from "solid-js";

import { useController } from "../../contexts/useObsWebSocket";
import useMicMuteState from "../../lib/useMicMuteState";
import { primitiveColors } from "../../theme/color";
import LoadingScreen from "../windows/LoadingScreen";
import { type WindowData } from "../windows/WindowContent";

import type OBSWebSocket from "obs-websocket-js";

export interface ControllerWindowData extends WindowData {
  type: "controller";
}

export const defaultControllerWindowData: ControllerWindowData = {
  type: "controller",
};

const Container = styled("div", {
  base: {
    width: "100%",
    height: "100%",
    position: "relative",
    backgroundColor: primitiveColors.black,
    backgroundImage: `repeating-linear-gradient(-45deg, ${primitiveColors.gray[900]}, ${primitiveColors.gray[900]} 10px, transparent 0, transparent 20px)`,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: "16px",
  },
});

const Button = styled("button", {
  base: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    backgroundColor: primitiveColors.gray[900],
    border: "none",
    outline: "none",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

const OBSProvider: Component = () => {
  const [obs, { refetch }] = useController();
  return (
    <Show when={obs.state === "ready"} fallback={<LoadingScreen />}>
      {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
      <Controller obs={obs()!} refetch={refetch} />
    </Show>
  );
};

const Controller: Component<{
  obs: OBSWebSocket;
  refetch: ResourceActions<OBSWebSocket | unknown, unknown>["refetch"];
}> = (props) => {
  const { isMuted, toggleMicMute } = useMicMuteState(props.obs);

  return (
    <Container>
      <Button
        onClick={() => {
          void toggleMicMute();
        }}
      >
        <Show
          when={isMuted()}
          fallback={
            <FaSolidMicrophone size={36} fill={primitiveColors.green[400]} />
          }
        >
          <FaSolidMicrophoneSlash size={46} fill={primitiveColors.pink[400]} />
        </Show>
      </Button>
      <Button
        onClick={() => {
          void props.refetch();
        }}
      >
        <FaSolidArrowRotateRight size={36} fill={primitiveColors.white} />
      </Button>
    </Container>
  );
};

export default OBSProvider;
