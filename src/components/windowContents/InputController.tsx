/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { styled } from "@macaron-css/solid";
import {
  FaSolidVolumeHigh,
  FaSolidVolumeXmark,
  FaSolidLockOpen,
  FaSolidLock,
} from "solid-icons/fa";
import {
  Show,
  type Component,
  createEffect,
  For,
  createSignal,
} from "solid-js";

import useInputList from "../../lib/useInputList";
import useInputMuteState from "../../lib/useInputMuteState";
import useInputVolume from "../../lib/useInputVolume";
import { primitiveColors } from "../../theme/color";
import CircularButton from "../CircularButton";
import RoundSlider from "../RoundSlider";
import ErrorScreen from "../window/ErrorScreen";
import { type WindowData } from "../window/WindowContent";

export interface InputControllerWindowData extends WindowData {
  type: "inputController";
}

export const defaultINputControllerWindowData: InputControllerWindowData = {
  type: "inputController",
};

const VolumeButtonContainer = styled("div", {
  base: {
    width: "100%",
    height: "100%",
    flexShrink: "1",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    overflow: "hidden",
  },
});

const SliderContainer = styled("div", {
  base: {
    position: "relative",
    width: "100%",
    objectFit: "contain",
  },
});

const ButtonWrapper = styled("div", {
  base: {
    position: "absolute",
    width: "50%",
    height: "50%",
    top: "49%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
});

const VolumeButtonLabel = styled("div", {
  base: {
    width: "100%",
    height: "auto",
    textAlign: "center",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    marginTop: "-16px",
  },
});

const VolumeButton: Component<{
  inputName: string;
}> = (props) => {
  const { isMuted, toggleMute } = useInputMuteState(() => props.inputName);
  const { volume, setVolume } = useInputVolume(() => props.inputName);

  const displayVolume = (volume: number | undefined) => {
    if (volume === undefined) {
      return "";
    }
    return volume.toFixed(2) + " dB";
  };

  return (
    <VolumeButtonContainer>
      {displayVolume(volume())}
      <SliderContainer>
        <RoundSlider
          value={() => volume() ?? 0}
          setter={(value) => {
            void setVolume(value);
          }}
          min={-100}
          max={0}
          width={22}
          startAngle={45}
        />
        <ButtonWrapper>
          <CircularButton
            onClick={() => {
              void toggleMute();
            }}
          >
            <Show
              when={isMuted()}
              fallback={
                <FaSolidVolumeHigh
                  size={"80%"}
                  fill={primitiveColors.green[400]}
                />
              }
            >
              <FaSolidVolumeXmark
                size={"80%"}
                fill={primitiveColors.pink[400]}
              />
            </Show>
          </CircularButton>
        </ButtonWrapper>
      </SliderContainer>
      <VolumeButtonLabel>{props.inputName}</VolumeButtonLabel>
    </VolumeButtonContainer>
  );
};

const Container = styled("div", {
  base: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
});

const ButtonsContainer = styled("div", {
  base: {
    width: "100%",
    height: "100%",
    position: "relative",
    padding: "4px 32px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: "32px",
  },
});

const Buttons = styled("div", {
  base: {
    position: "absolute",
    top: "0",
    left: "0",
    display: "flex",
    flexDirection: "row",
    transition: "opacity 0.2s ease",
    opacity: "0.1",
    selectors: {
      "&:hover": {
        opacity: "1",
      },
    },
  },
});

const Button = styled("div", {
  base: {
    width: "32px",
    height: "32px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "auto",
    cursor: "pointer",
    selectors: {
      "&:hover": {
        backgroundColor: primitiveColors.whiteAlpha[400],
      },
    },
  },
});

const InputController: Component = () => {
  const { globalOBSInputs } = useInputList();
  const [locked, setLocked] = createSignal<boolean>(true);

  createEffect(() => {
    console.log(globalOBSInputs());
  });

  return (
    <Container>
      <div
        style={{
          width: "100%",
          height: "100%",
          cursor: locked() ? "not-allowed" : "auto",
        }}
      >
        <ButtonsContainer
          style={{
            "pointer-events": locked() ? "none" : "auto",
          }}
        >
          <For
            each={globalOBSInputs()}
            fallback={<ErrorScreen message="No inputs found" />}
          >
            {(input) => <VolumeButton inputName={input.inputName} />}
          </For>
        </ButtonsContainer>
      </div>
      <Buttons>
        <Button
          onClick={() => {
            setLocked((l) => !l);
          }}
        >
          <Show
            when={locked()}
            fallback={
              <FaSolidLockOpen fill={primitiveColors.gray[700]} size={24} />
            }
          >
            <FaSolidLock fill={primitiveColors.gray[700]} size={24} />
          </Show>
        </Button>
      </Buttons>
    </Container>
  );
};

export default InputController;
