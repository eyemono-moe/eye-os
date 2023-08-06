/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { keyframes } from "@macaron-css/core";
import { styled } from "@macaron-css/solid";
import { createSignal, onMount, type ParentComponent } from "solid-js";

import {
  type Position,
  type WindowInfo,
  useWindows,
} from "../../contexts/useWindows";
import { primitiveColors } from "../../theme/color";

import MinimizeButton from "./MinimizeButton";
import WindowContent from "./WindowContent";

const MIN_WIDTH = 100;
const MIN_HEIGHT = 100;

const headerHeight = 36;
const edgeWidth = 4;
const borderRadius = 8;

const MaximizeAnimation = keyframes({
  from: {
    transform: "translateY(400px) scale(0)",
    opacity: 0,
  },
  to: {
    transform: "translateY(0) scale(1)",
    opacity: 1,
  },
});

const MinimizeAnimation = keyframes({
  from: {
    transform: "translateY(0) scale(1)",
    opacity: 1,
  },
  to: {
    transform: "translateY(400px) scale(0)",
    opacity: 0,
  },
});

const Container = styled("div", {
  base: {
    position: "absolute",
    display: "grid",
    gridTemplateColumns: `${edgeWidth}px 1fr ${edgeWidth}px`,
    gridTemplateRows: `${edgeWidth}px ${
      headerHeight - edgeWidth
    }px 1fr ${edgeWidth}px`,
    animationDuration: "0.5s",
    animationIterationCount: 1,
    animationFillMode: "forwards",
    pointerEvents: "auto",
  },
});

const Edge = styled("div", {
  base: {},
  variants: {
    direction: {
      topLeft: {
        gridColumn: "1 / 2",
        gridRow: "1 / 2",
        cursor: "nwse-resize",
      },
      top: {
        gridColumn: "2 / 3",
        gridRow: "1 / 2",
        cursor: "ns-resize",
      },
      topRight: {
        gridColumn: "3 / 4",
        gridRow: "1 / 2",
        cursor: "nesw-resize",
      },
      left: {
        gridColumn: "1 / 2",
        gridRow: "2 / 4",
        cursor: "ew-resize",
      },
      right: {
        gridColumn: "3 / 4",
        gridRow: "2 / 4",
        cursor: "ew-resize",
      },
      bottomLeft: {
        gridColumn: "1 / 2",
        gridRow: "4 / 5",
        cursor: "nesw-resize",
      },
      bottom: {
        gridColumn: "2 / 3",
        gridRow: "4 / 5",
        cursor: "ns-resize",
      },
      bottomRight: {
        gridColumn: "3 / 4",
        gridRow: "4 / 5",
        cursor: "nwse-resize",
      },
    },
  },
});

const HeaderWrapper = styled("div", {
  base: {
    gridColumn: "2 / 3",
    gridRow: "2 / 3",
    display: "flex",
  },
});

const Header = styled("div", {
  base: {
    width: "100%",
    cursor: "move",
    display: "flex",
    alignItems: "center",
  },
});

const HeaderTitle = styled("div", {
  base: {
    fontSize: "18px",
    fontWeight: "bold",
    marginLeft: "8px",
    color: primitiveColors.white,
  },
});

const Background = styled("div", {
  base: {
    gridColumn: "2 / 3",
    gridRow: "2 / 4",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    boxSizing: "content-box",
    outlineStyle: "solid",
    outlineWidth: `${edgeWidth}px`,
    borderRadius: `${borderRadius}px`,
    pointerEvents: "none",
  },
});

const ContentWrapper = styled("div", {
  base: {
    gridColumn: "2 / 3",
    gridRow: "3 / 4",
    overflow: "hidden",
    borderRadius: `0 0 ${borderRadius}px ${borderRadius}px`,
  },
});

interface WindowProps {
  windowInfo: WindowInfo;
  index: () => number;
}

const Window: ParentComponent<WindowProps> = (props) => {
  let headerRef: HTMLDivElement;
  let topLeftRef: HTMLDivElement;
  let topRef: HTMLDivElement;
  let topRightRef: HTMLDivElement;
  let leftRef: HTMLDivElement;
  let rightRef: HTMLDivElement;
  let bottomLeftRef: HTMLDivElement;
  let bottomRef: HTMLDivElement;
  let bottomRightRef: HTMLDivElement;

  const [_, { setState, setTop: setZIndex }] = useWindows();

  const [offsetPosition, setOffsetPosition] = createSignal<Position>({
    x: 0,
    y: 0,
  });

  const handlePointerMoveOnLeft = (e: PointerEvent) => {
    let newX = e.pageX - offsetPosition().x;
    if (props.windowInfo.bottomRight.x - newX < MIN_WIDTH) {
      newX = props.windowInfo.bottomRight.x - MIN_WIDTH;
    }
    setState("windows", props.index(), "topLeft", "x", newX);
  };

  const handlePointerMoveOnTop = (e: PointerEvent) => {
    let newY = e.pageY - offsetPosition().y;
    if (props.windowInfo.bottomRight.y - newY < MIN_HEIGHT) {
      newY = props.windowInfo.bottomRight.y - MIN_HEIGHT;
    }
    setState("windows", props.index(), "topLeft", "y", newY);
  };

  const handlePointerMoveOnRight = (e: PointerEvent) => {
    let newX = e.pageX - offsetPosition().x + edgeWidth;
    if (newX - props.windowInfo.topLeft.x < MIN_WIDTH) {
      newX = props.windowInfo.topLeft.x + MIN_WIDTH;
    }
    setState("windows", props.index(), "bottomRight", "x", newX);
  };

  const handlePointerMoveOnBottom = (e: PointerEvent) => {
    let newY = e.pageY - offsetPosition().y + edgeWidth;
    if (newY - props.windowInfo.topLeft.y < MIN_WIDTH) {
      newY = props.windowInfo.topLeft.y + MIN_WIDTH;
    }
    setState("windows", props.index(), "bottomRight", "y", newY);
  };

  const handleHeaderMove = (e: PointerEvent) => {
    const deltaX =
      e.pageX - props.windowInfo.topLeft.x - offsetPosition().x - edgeWidth;
    const deltaY =
      e.pageY - props.windowInfo.topLeft.y - offsetPosition().y - edgeWidth;
    setState("windows", props.index(), "topLeft", "x", (p) => p + deltaX);
    setState("windows", props.index(), "topLeft", "y", (p) => p + deltaY);
    setState("windows", props.index(), "bottomRight", "x", (p) => p + deltaX);
    setState("windows", props.index(), "bottomRight", "y", (p) => p + deltaY);
  };

  const handlePointerDown = (
    ref: HTMLElement,
    pointerMoveHandler: (e: PointerEvent) => void,
  ) => {
    ref.addEventListener("pointerdown", (e: PointerEvent) => {
      if (e.button !== 0) return;
      ref.setPointerCapture(e.pointerId);
      setOffsetPosition({
        x: e.offsetX,
        y: e.offsetY,
      });
      ref.addEventListener("pointermove", pointerMoveHandler);
      ref.addEventListener(
        "pointerup",
        (e: PointerEvent) => {
          ref.removeEventListener("pointermove", pointerMoveHandler);
          ref.releasePointerCapture(e.pointerId);
        },
        { once: true },
      );
    });
  };

  onMount(() => {
    handlePointerDown(topLeftRef, (e) => {
      handlePointerMoveOnTop(e);
      handlePointerMoveOnLeft(e);
    });

    handlePointerDown(topRef, handlePointerMoveOnTop);

    handlePointerDown(topRightRef, (e) => {
      handlePointerMoveOnTop(e);
      handlePointerMoveOnRight(e);
    });

    handlePointerDown(leftRef, handlePointerMoveOnLeft);

    handlePointerDown(rightRef, handlePointerMoveOnRight);

    handlePointerDown(bottomLeftRef, (e) => {
      handlePointerMoveOnBottom(e);
      handlePointerMoveOnLeft(e);
    });

    handlePointerDown(bottomRef, handlePointerMoveOnBottom);

    handlePointerDown(bottomRightRef, (e) => {
      handlePointerMoveOnBottom(e);
      handlePointerMoveOnRight(e);
    });

    handlePointerDown(headerRef, handleHeaderMove);
  });

  return (
    <Container
      style={{
        height: `${
          props.windowInfo.bottomRight.y - props.windowInfo.topLeft.y
        }px`,
        left: `${props.windowInfo.topLeft.x}px`,
        top: `${props.windowInfo.topLeft.y}px`,
        width: `${
          props.windowInfo.bottomRight.x - props.windowInfo.topLeft.x
        }px`,
        "animation-name": props.windowInfo.minimized
          ? MinimizeAnimation
          : MaximizeAnimation,
        "z-index": props.windowInfo.zIndex,
      }}
      onPointerDown={() => {
        setZIndex(props.index());
      }}
    >
      <Background
        style={{
          "outline-color": props.windowInfo.color,
        }}
      />
      <Edge ref={topLeftRef!} direction="topLeft" />
      <Edge ref={topRef!} direction="top" />
      <Edge ref={topRightRef!} direction="topRight" />
      <Edge ref={leftRef!} direction="left" />
      <Edge ref={rightRef!} direction="right" />
      <Edge ref={bottomLeftRef!} direction="bottomLeft" />
      <Edge ref={bottomRef!} direction="bottom" />
      <Edge ref={bottomRightRef!} direction="bottomRight" />
      <HeaderWrapper
        style={{
          "background-color": props.windowInfo.color,
        }}
      >
        <Header ref={headerRef!}>
          <HeaderTitle>{props.windowInfo.title}</HeaderTitle>
        </Header>
        <MinimizeButton
          onClick={() => {
            setState("windows", props.index(), "minimized", true);
          }}
        />
      </HeaderWrapper>
      <ContentWrapper>
        <WindowContent type={props.windowInfo.type} />
      </ContentWrapper>
    </Container>
  );
};

export default Window;
