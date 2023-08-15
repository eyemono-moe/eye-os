import { styled } from "@macaron-css/solid";
import {
  FaSolidArrowRotateLeft,
  FaSolidPause,
  FaSolidPlay,
} from "solid-icons/fa";
import { Show, type Component } from "solid-js";

import useStopWatch from "../../lib/useStopWatch";
import { primitiveColors, semanticColors } from "../../theme/color";
import CircularButton from "../CircularButton";
import { type WindowData } from "../window/WindowContent";

export interface StopwatchWindowData extends WindowData {
  type: "stopwatch";
}

export const defaultStopwatchWindowData: StopwatchWindowData = {
  type: "stopwatch",
};

const Container = styled("div", {
  base: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: semanticColors.ui.background,
  },
});

const Time = styled("div", {
  base: {
    width: "100%",
    height: "auto",
    textAlign: "center",
    fontSize: "48px",
  },
});

const Buttons = styled("div", {
  base: {
    width: "100%",
    height: "auto",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: "16px",
  },
});

const ButtonWrapper = styled("div", {
  base: {
    width: "64px",
    height: "64px",
  },
});

const Stopwatch: Component = () => {
  const { start, stop, millisecond, second, minute, hour, reset, isRunning } =
    useStopWatch();

  return (
    <Container>
      <Time>
        {`${hour().toString().padStart(2, "0")}:${minute()
          .toString()
          .padStart(2, "0")}:${second()
          .toString()
          .padStart(2, "0")}.${millisecond().toString().padStart(3, "0")}`}
      </Time>
      <Buttons>
        <Show
          when={isRunning()}
          fallback={
            <ButtonWrapper>
              <CircularButton onClick={start}>
                <FaSolidPlay size={24} fill={primitiveColors.pink[400]} />
              </CircularButton>
            </ButtonWrapper>
          }
        >
          <ButtonWrapper>
            <CircularButton onClick={stop}>
              <FaSolidPause size={24} fill={primitiveColors.pink[400]} />
            </CircularButton>
          </ButtonWrapper>
        </Show>
        <ButtonWrapper>
          <CircularButton onClick={reset}>
            <FaSolidArrowRotateLeft
              size={24}
              fill={primitiveColors.pink[400]}
            />
          </CircularButton>
        </ButtonWrapper>
      </Buttons>
    </Container>
  );
};

export default Stopwatch;
