import { lazy, type Component } from "solid-js";
import { Dynamic } from "solid-js/web";

export const windowContentsMap = {
  default: lazy(async () => await import("./windowContents/Default")),
  clock: lazy(async () => await import("./windowContents/Clock")),
};

export interface WindowContentProps {
  type: keyof typeof windowContentsMap;
}

const WindowContent: Component<WindowContentProps> = (props) => {
  return <Dynamic component={windowContentsMap[props.type]} />;
};

export default WindowContent;
