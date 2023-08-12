import { styled } from "@macaron-css/solid";
import { type Component } from "solid-js";

import useClock from "../lib/useClock";

const Container = styled("div", {
  base: {
    width: "auto",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
});

const TaskBarClock: Component = () => {
  const { year, month, day, hour, minute, second } = useClock();

  return (
    <Container>
      <div>
        {`${hour().toString().padStart(2, "0")}:${minute()
          .toString()
          .padStart(2, "0")}:${second().toString().padStart(2, "0")}`}
      </div>
      <div>
        {`${year()}/${month().toString().padStart(2, "0")}/${day()
          .toString()
          .padStart(2, "0")}`}
      </div>
    </Container>
  );
};

export default TaskBarClock;
