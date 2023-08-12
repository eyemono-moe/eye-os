import { styled } from "@macaron-css/solid";
import { For, type Component } from "solid-js";

import { useWindows } from "../contexts/useWindows";
import { primitiveColors, semanticColors } from "../theme/color";

import AddWindowButton from "./AddWindowButton";
import OsButton from "./OsButton";
import TaskBarClock from "./TaskBarClock";

const Container = styled("div", {
  base: {
    width: "100%",
    height: "auto",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "0 16px",
    backgroundColor: primitiveColors.green[900],
  },
});

const TaskBarItemsLeft = styled("div", {
  base: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: "4px",
  },
});
const TaskBarItemsRight = styled("div", {
  base: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: "4px",
  },
});

const MinimizedWindow = styled("div", {
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
        backgroundColor: semanticColors.ui.hoverWhite,
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
      <TaskBarItemsLeft>
        <OsButton />
        <For each={state.windows}>
          {(window, i) => (
            <MinimizedWindow
              minimized={window.minimized}
              onClick={() => {
                setState("windows", i(), "minimized", false);
                setTop(i());
              }}
            >
              {window.icon}
            </MinimizedWindow>
          )}
        </For>
        <AddWindowButton />
      </TaskBarItemsLeft>
      <TaskBarItemsRight>
        <TaskBarClock />
      </TaskBarItemsRight>
    </Container>
  );
};

export default TaskBar;
