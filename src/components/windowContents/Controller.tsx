/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { styled } from "@macaron-css/solid";
import {
  FaSolidArrowRotateRight,
  FaSolidMicrophone,
  FaSolidMicrophoneSlash,
  FaSolidVolumeHigh,
  FaSolidVolumeXmark,
} from "solid-icons/fa";
import { Show, type Component } from "solid-js";

import { DESKTOP_INPUT_NAME, MIC_INPUT_NAME } from "../../consts";
import { useObsWebSocket } from "../../contexts/useObsWebSocket";
import useInputMuteState from "../../lib/useInputMuteState";
import useInputVolume from "../../lib/useInputVolume";
import { primitiveColors, semanticColors } from "../../theme/color";
import RoundSlider from "../RoundSlider";
import { type WindowData } from "../window/WindowContent";

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
    width: "48px",
    height: "48px",
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
    width: "100px",
    height: "100px",
    position: "relative",
    display: "grid",
    placeItems: "center",
  },
});

const SliderWrapper = styled("div", {
  base: {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    display: "grid",
    placeItems: "center",
  },
});

const Controller: Component = () => {
  const [obs, { refetch }] = useObsWebSocket()!;
  const { isMuted: isMicMuted, toggleMute: toggleMicMute } = useInputMuteState(
    obs()!,
    MIC_INPUT_NAME,
  );
  const { volume: micVolume, setVolume: setMicVolume } = useInputVolume(
    obs()!,
    MIC_INPUT_NAME,
  );
  const { isMuted: isDesktopMuted, toggleMute: toggleDesktopMute } =
    useInputMuteState(obs()!, "デスクトップ音声");
  const { volume: desktopVolume, setVolume: setDesktopVolume } = useInputVolume(
    obs()!,
    DESKTOP_INPUT_NAME,
  );

  return (
    <Container>
      <SliderContainer>
        <SliderWrapper>
          <RoundSlider
            value={() => desktopVolume() ?? 0}
            setter={(value) => {
              void setDesktopVolume(value);
            }}
            min={-100}
            max={26}
            size={100}
            width={22}
            startAngle={45}
          />
        </SliderWrapper>
        <Button
          onClick={() => {
            void toggleDesktopMute();
          }}
        >
          <Show
            when={isDesktopMuted()}
            fallback={
              <FaSolidVolumeHigh size={28} fill={primitiveColors.green[400]} />
            }
          >
            <FaSolidVolumeXmark size={26} fill={primitiveColors.pink[400]} />
          </Show>
        </Button>
      </SliderContainer>
      <SliderContainer>
        <SliderWrapper>
          <RoundSlider
            value={() => micVolume() ?? 0}
            setter={(value) => {
              void setMicVolume(value);
            }}
            min={-100}
            max={26}
            size={100}
            width={22}
            startAngle={45}
          />
        </SliderWrapper>
        <Button
          onClick={() => {
            void toggleMicMute();
          }}
        >
          <Show
            when={isMicMuted()}
            fallback={
              <FaSolidMicrophone size={26} fill={primitiveColors.green[400]} />
            }
          >
            <FaSolidMicrophoneSlash
              size={34}
              fill={primitiveColors.pink[400]}
            />
          </Show>
        </Button>
      </SliderContainer>
      <Button
        onClick={() => {
          void refetch();
        }}
      >
        <FaSolidArrowRotateRight size={24} fill={primitiveColors.white} />
      </Button>
    </Container>
  );
};

export default Controller;
