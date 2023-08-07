import { styled } from "@macaron-css/solid";
import { type Component } from "solid-js";

import useClock from "../../lib/useClock";
import { primitiveColors } from "../../theme/color";
import { type WindowData } from "../windows/WindowContent";

export interface ClockWindowOptions extends WindowData {
  type: "clock";
}

const Container = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "FOT-ラグランパンチ Std UB",
    fontSize: "84px",
    fontStyle: "normal",
    width: "100%",
    height: "100%",
    lineHeight: "100%",
    backgroundColor: primitiveColors.black,
    backgroundImage: `repeating-linear-gradient(-45deg, ${primitiveColors.gray[50]}, ${primitiveColors.gray[50]} 10px, transparent 0, transparent 20px)`,
    color: primitiveColors.pink[400],
  },
});

const DateContainer = styled("div", {
  base: {
    fontSize: "32px",
    lineHeight: "100%",
  },
});

const Clock: Component = () => {
  const { month, day, hour, minute } = useClock();

  return (
    <Container>
      <DateContainer>{`${month().toString().padStart(2, "0")}/${day()
        .toString()
        .padStart(2, "0")}`}</DateContainer>
      {`${hour().toString().padStart(2, "0")}:${minute()
        .toString()
        .padStart(2, "0")}`}
    </Container>
  );
};

export default Clock;
