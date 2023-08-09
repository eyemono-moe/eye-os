import { styled } from "@macaron-css/solid";
import {
  FaSolidArrowRotateRight,
  FaSolidMicrophone,
  FaSolidMicrophoneSlash,
  FaSolidVolumeHigh,
  FaSolidVolumeXmark,
} from "solid-icons/fa";
import { Show, type Component, type ResourceActions } from "solid-js";

import { useController } from "../../contexts/useObsWebSocket";
import useInputMuteState from "../../lib/useInputMuteState";
import useInputVolume from "../../lib/useInputVolume";
import { primitiveColors, semanticColors } from "../../theme/color";
import RoundSlider from "../RoundSlider";
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
    background: semanticColors.ui.background,
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
    backgroundColor: primitiveColors.black,
    borderColor: primitiveColors.pink[400],
    borderWidth: "4px",
    outline: "none",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: "1",
    selectors: {
      "&:hover": {
        backgroundColor: primitiveColors.gray[900],
      },
    },
  },
});

const SliderContainer = styled("div", {
  base: {
    width: "128px",
    height: "128px",
    position: "relative",
    display: "grid",
    placeItems: "center",
    gridTemplateColumns: "1fr",
    gridTemplateRows: "1fr",
  },
});

const OBSProvider: Component = () => {
  const controller = useController();
  return (
    <Show
      when={controller != null && controller[0].state === "ready"}
      fallback={<LoadingScreen />}
    >
      {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
      <Controller obs={controller![0]()!} refetch={controller![1].refetch} />
    </Show>
  );
};

const Controller: Component<{
  obs: OBSWebSocket;
  refetch: ResourceActions<OBSWebSocket | unknown, unknown>["refetch"];
}> = (props) => {
  const { isMuted: isMicMuted, toggleMute: toggleMicMute } = useInputMuteState(
    props.obs,
    "マイク",
  );
  const { volume: micVolume, setVolume: setMicVolume } = useInputVolume(
    props.obs,
    "マイク",
  );
  const { isMuted: isDesktopMuted, toggleMute: toggleDesktopMute } =
    useInputMuteState(props.obs, "デスクトップ音声");
  const { volume: desktopVolume, setVolume: setDesktopVolume } = useInputVolume(
    props.obs,
    "デスクトップ音声",
  );

  return (
    <Container>
      <SliderContainer>
        <RoundSlider
          value={() => desktopVolume() ?? 0}
          setter={(value) => {
            void setDesktopVolume(value);
          }}
          min={-100}
          max={26}
          step={1}
          startAngle={45}
        />
        <Button
          onClick={() => {
            void toggleDesktopMute();
          }}
        >
          <Show
            when={isDesktopMuted()}
            fallback={
              <FaSolidVolumeHigh size={46} fill={primitiveColors.green[400]} />
            }
          >
            <FaSolidVolumeXmark size={44} fill={primitiveColors.pink[400]} />
          </Show>
        </Button>
      </SliderContainer>
      <SliderContainer>
        <RoundSlider
          value={() => micVolume() ?? 0}
          setter={(value) => {
            void setMicVolume(value);
          }}
          min={-100}
          max={26}
          step={1}
          startAngle={45}
        />
        <Button
          onClick={() => {
            void toggleMicMute();
          }}
        >
          <Show
            when={isMicMuted()}
            fallback={
              <FaSolidMicrophone size={36} fill={primitiveColors.green[400]} />
            }
          >
            <FaSolidMicrophoneSlash
              size={46}
              fill={primitiveColors.pink[400]}
            />
          </Show>
        </Button>
      </SliderContainer>
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
