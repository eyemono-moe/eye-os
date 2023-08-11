import { styled } from "@macaron-css/solid";
import { type Component } from "solid-js";

import useClock from "../../lib/useClock";
import { primitiveColors, semanticColors } from "../../theme/color";
import { fontFamily } from "../../theme/font";
import { type WindowData } from "../window/WindowContent";

export interface ClockWindowData extends WindowData {
  type: "clock";
}

export const defaultClockWindowData: ClockWindowData = {
  type: "clock",
};

const Container = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: fontFamily.raglanPunch,
    fontSize: "48px",
    fontStyle: "normal",
    width: "100%",
    height: "100%",
    lineHeight: "100%",
    background: semanticColors.ui.background,
    color: primitiveColors.pink[400],
  },
});

const DateContainer = styled("div", {
  base: {
    fontSize: "22px",
    lineHeight: "100%",
  },
});

const Clock: Component = () => {
  const { year, month, day, hour, minute } = useClock();

  return (
    <Container>
      <DateContainer>{`${year()}/${month().toString().padStart(2, "0")}/${day()
        .toString()
        .padStart(2, "0")}`}</DateContainer>
      {`${hour().toString().padStart(2, "0")}:${minute()
        .toString()
        .padStart(2, "0")}`}
    </Container>
  );
};

export default Clock;
