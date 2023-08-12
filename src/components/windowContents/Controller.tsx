/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { styled } from "@macaron-css/solid";
import {
  FaSolidMicrophone,
  FaSolidMicrophoneSlash,
  FaSolidVolumeHigh,
  FaSolidVolumeXmark,
} from "solid-icons/fa";
import { Show, type Component, Switch, Match, type JSX } from "solid-js";

import { DESKTOP_INPUT_NAME, MIC_INPUT_NAME } from "../../consts";
import { useObsWebSocket } from "../../contexts/useObsWebSocket";
import useInputMuteState from "../../lib/useInputMuteState";
import useInputVolume from "../../lib/useInputVolume";
import { primitiveColors, semanticColors } from "../../theme/color";
import CircularButton from "../CircularButton";
import RoundSlider from "../RoundSlider";
import ErrorScreen from "../window/ErrorScreen";
import LoadingScreen from "../window/LoadingScreen";
import { type WindowData } from "../window/WindowContent";

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

const VolumeButton: Component<{
  inputName: string;
  obs: OBSWebSocket;
  onMute: JSX.Element;
  offMute: JSX.Element;
}> = (props) => {
  const { isMuted, toggleMute } = useInputMuteState(props.obs, props.inputName);
  const { volume, setVolume } = useInputVolume(props.obs, props.inputName);

  return (
    <SliderContainer>
      <SliderWrapper>
        <RoundSlider
          value={() => volume() ?? 0}
          setter={(value) => {
            void setVolume(value);
          }}
          min={-100}
          max={26}
          size={100}
          width={22}
          startAngle={45}
        />
      </SliderWrapper>
      <CircularButton
        onClick={() => {
          void toggleMute();
        }}
      >
        <Show when={isMuted()} fallback={props.onMute}>
          {props.offMute}
        </Show>
      </CircularButton>
    </SliderContainer>
  );
};

const Controller: Component = () => {
  const {
    obsResource: [obs],
  } = useObsWebSocket();

  return (
    <Switch fallback={<LoadingScreen />}>
      <Match when={obs.state === "ready"}>
        <Container>
          <VolumeButton
            inputName={DESKTOP_INPUT_NAME}
            obs={obs()!}
            onMute={
              <FaSolidVolumeHigh size={28} fill={primitiveColors.green[400]} />
            }
            offMute={
              <FaSolidVolumeXmark size={26} fill={primitiveColors.pink[400]} />
            }
          />
          <VolumeButton
            inputName={MIC_INPUT_NAME}
            obs={obs()!}
            onMute={
              <FaSolidMicrophone size={26} fill={primitiveColors.green[400]} />
            }
            offMute={
              <FaSolidMicrophoneSlash
                size={34}
                fill={primitiveColors.pink[400]}
              />
            }
          />
        </Container>
      </Match>
      <Match when={obs.state === "errored"} children={<ErrorScreen />} />
    </Switch>
  );
};

export default Controller;
