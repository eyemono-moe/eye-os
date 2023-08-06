import { styled } from "@macaron-css/solid";
import { For, type Component } from "solid-js";

import { useWindows } from "../contexts/useWindows";
import firstChar from "../lib/firstChar";
import { primitiveColors } from "../theme/color";

import OsButton from "./OsButton";

const Container = styled("div", {
  base: {
    width: "100%",
    backgroundColor: primitiveColors.green[900],
  },
});

const TaskBaritems = styled("div", {
  base: {
    display: "flex",
    flexDirection: "row",
    gap: "4px",
  },
});

const TaskBarItem = styled("div", {
  base: {
    width: "80px",
    height: "40px",
    backgroundColor: primitiveColors.whiteAlpha[100],
    borderBottom: `4px solid ${primitiveColors.green[400]}`,
    fontSize: "24px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    selectors: {
      "&:hover": {
        backgroundColor: primitiveColors.whiteAlpha[400],
      },
    },
  },
  variants: {
    minimized: {
      true: {
        backgroundColor: primitiveColors.whiteAlpha[300],
      },
    },
  },
});

const TaskBar: Component = () => {
  const [state, { setState, setTop }] = useWindows();

  return (
    <Container>
      <TaskBaritems>
        <OsButton />
        <For each={state.windows}>
          {(window, i) => (
            <TaskBarItem
              minimized={window.minimized}
              onClick={() => {
                setState("windows", i(), "minimized", false);
                setTop(i());
              }}
            >
              {firstChar(window.title)}
            </TaskBarItem>
          )}
        </For>
      </TaskBaritems>
    </Container>
  );
};

export default TaskBar;
