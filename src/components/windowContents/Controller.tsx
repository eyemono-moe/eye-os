/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { styled } from "@macaron-css/solid";
import {
  FaSolidMicrophone,
  FaSolidMicrophoneSlash,
  FaSolidVolumeHigh,
  FaSolidVolumeXmark,
} from "solid-icons/fa";
import {
  Show,
  type Component,
  createEffect,
  Switch,
  Match,
  type JSX,
} from "solid-js";

import { DESKTOP_INPUT_NAME, MIC_INPUT_NAME } from "../../consts";
import { useObsWebSocket } from "../../contexts/useObsWebSocket";
import useInputMuteState from "../../lib/useInputMuteState";
import useInputVolume from "../../lib/useInputVolume";
import { logger } from "../../lib/useLog";
import { primitiveColors, semanticColors } from "../../theme/color";
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
      <Button
        onClick={() => {
          void toggleMute();
        }}
      >
        <Show when={isMuted()} fallback={props.onMute}>
          {props.offMute}
        </Show>
      </Button>
    </SliderContainer>
  );
};

const Controller: Component = () => {
  const {
    obsResource: [obs],
  } = useObsWebSocket();

  createEffect(() => {
    logger.log(obs.state);
  });

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
