import { type Component } from "solid-js";

import useClock from "../lib/useClock";

const Clock: Component = () => {
  const { hour, minute } = useClock();

  return (
    <div>{`${hour().toString().padStart(2, "0")}:${minute()
      .toString()
      .padStart(2, "0")}`}</div>
  );
};

export default Clock;
