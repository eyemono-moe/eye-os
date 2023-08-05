import { type Component } from "solid-js";

import Clock from "./Clock";

const Window: Component = () => {
  return (
    <div>
      <h2>Window</h2>
      <Clock />
    </div>
  );
};

export default Window;
