import { styled } from "@macaron-css/solid";
import { FaRegularTrashCan } from "solid-icons/fa";
import { type Component, For, createSignal, createEffect } from "solid-js";

import { isScrolledToBottom } from "../../lib/scroll";
import toISOStringWithTimezone from "../../lib/toISOStringWithTimezone";
import { logger, logs } from "../../lib/useLog";
import { primitiveColors } from "../../theme/color";
import { fontFamily } from "../../theme/font";
import { type WindowData } from "../window/WindowContent";

export interface LogWindowData extends WindowData {
  type: "log";
}

export const defaultLogWindowData: LogWindowData = {
  type: "log",
};

const Container = styled("div", {
  base: {
    width: "100%",
    height: "100%",
  },
});

const LogContainer = styled("div", {
  base: {
    width: "100%",
    height: "100%",
    overflowY: "auto",
    userSelect: "text",
  },
});

const LogPre = styled("pre", {
  base: {
    fontFamily: fontFamily.mono,
    width: "100%",
    whiteSpace: "pre-wrap",
  },
  variants: {
    type: {
      log: {
        color: primitiveColors.white,
      },
      error: {
        color: primitiveColors.pink[200],
      },
    },
  },
});

const TimeStamp = styled("span", {
  base: {
    color: primitiveColors.green[400],
    selectors: {
      "&::after": {
        content: "]",
        color: primitiveColors.white,
      },
      "&::before": {
        content: "[",
        color: primitiveColors.white,
      },
    },
  },
});

const Buttons = styled("div", {
  base: {
    position: "absolute",
    top: "0",
    right: "0",
    display: "flex",
    flexDirection: "row",
    marginRight: "18px",
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
    selectors: {
      "&:hover": {
        backgroundColor: primitiveColors.whiteAlpha[400],
      },
    },
  },
});

const Log: Component = () => {
  let ref: HTMLDivElement;

  const [atBottom, setAtBottom] = createSignal(true);
  const onScroll = (e: { target: Element }) =>
    setAtBottom(isScrolledToBottom(e.target));

  createEffect(() => {
    logs();
    if (atBottom()) {
      ref.scrollTop = ref.scrollHeight;
    }
  });

  return (
    <Container>
      <Buttons>
        <Button onClick={logger.clear}>
          <FaRegularTrashCan fill={primitiveColors.gray[700]} size={24} />
        </Button>
      </Buttons>
      {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
      <LogContainer ref={ref!} onScroll={onScroll}>
        <For each={logs()}>
          {(log) => (
            <LogPre type={log.type}>
              <TimeStamp>
                {toISOStringWithTimezone(new Date(log.timestamp))}
              </TimeStamp>{" "}
              {log.message}
            </LogPre>
          )}
        </For>
      </LogContainer>
    </Container>
  );
};

export default Log;
