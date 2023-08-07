/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { keyframes } from "@macaron-css/core";
import { styled } from "@macaron-css/solid";
import {
  createSignal,
  ErrorBoundary,
  onMount,
  type ParentComponent,
} from "solid-js";

import { type Position } from "../../contexts/useWindows";
import usePopup from "../../lib/usePopup";
import { primitiveColors } from "../../theme/color";

import CloseButton from "./CloseButton";
import EditButton from "./EditButton";
import EditPopup from "./EditPopup";
import LoadingScreen from "./LoadingScreen";
import MinimizeButton from "./MinimizeButton";
import WindowContent from "./WindowContent";
import { useWindow } from "./Windows";

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
    userSelect: "none",
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
    boxSizing: "content-box",
    outlineStyle: "solid",
    outlineWidth: `${edgeWidth}px`,
    borderRadius: `${borderRadius}px`,
    pointerEvents: "none",
    boxShadow: `8px 8px 1px 0px ${primitiveColors.blackAlpha[700]}`,
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

const Window: ParentComponent = () => {
  let headerRef: HTMLDivElement;
  let topLeftRef: HTMLDivElement;
  let topRef: HTMLDivElement;
  let topRightRef: HTMLDivElement;
  let leftRef: HTMLDivElement;
  let rightRef: HTMLDivElement;
  let bottomLeftRef: HTMLDivElement;
  let bottomRef: HTMLDivElement;
  let bottomRightRef: HTMLDivElement;

  const [windowInfo, { setState, setTop, removeWindow, index }] = useWindow()!;
  const { Popup, open } = usePopup();

  const [offsetPosition, setOffsetPosition] = createSignal<Position>({
    x: 0,
    y: 0,
  });

  const handlePointerMoveOnLeft = (e: PointerEvent) => {
    let newX = e.pageX - offsetPosition().x;
    if (windowInfo.bottomRight.x - newX < MIN_WIDTH) {
      newX = windowInfo.bottomRight.x - MIN_WIDTH;
    }
    setState("windows", index(), "topLeft", "x", newX);
  };

  const handlePointerMoveOnTop = (e: PointerEvent) => {
    let newY = e.pageY - offsetPosition().y;
    if (windowInfo.bottomRight.y - newY < MIN_HEIGHT) {
      newY = windowInfo.bottomRight.y - MIN_HEIGHT;
    }
    setState("windows", index(), "topLeft", "y", newY);
  };

  const handlePointerMoveOnRight = (e: PointerEvent) => {
    let newX = e.pageX - offsetPosition().x + edgeWidth;
    if (newX - windowInfo.topLeft.x < MIN_WIDTH) {
      newX = windowInfo.topLeft.x + MIN_WIDTH;
    }
    setState("windows", index(), "bottomRight", "x", newX);
  };

  const handlePointerMoveOnBottom = (e: PointerEvent) => {
    let newY = e.pageY - offsetPosition().y + edgeWidth;
    if (newY - windowInfo.topLeft.y < MIN_WIDTH) {
      newY = windowInfo.topLeft.y + MIN_WIDTH;
    }
    setState("windows", index(), "bottomRight", "y", newY);
  };

  const handleHeaderMove = (e: PointerEvent) => {
    const deltaX =
      e.pageX - windowInfo.topLeft.x - offsetPosition().x - edgeWidth;
    const deltaY =
      e.pageY - windowInfo.topLeft.y - offsetPosition().y - edgeWidth;
    setState("windows", index(), "topLeft", "x", (p) => p + deltaX);
    setState("windows", index(), "topLeft", "y", (p) => p + deltaY);
    setState("windows", index(), "bottomRight", "x", (p) => p + deltaX);
    setState("windows", index(), "bottomRight", "y", (p) => p + deltaY);
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
        height: `${windowInfo.bottomRight.y - windowInfo.topLeft.y}px`,
        left: `${windowInfo.topLeft.x}px`,
        top: `${windowInfo.topLeft.y}px`,
        width: `${windowInfo.bottomRight.x - windowInfo.topLeft.x}px`,
        "animation-name": windowInfo.minimized
          ? MinimizeAnimation
          : MaximizeAnimation,
        "z-index": windowInfo.zIndex,
      }}
      onPointerDown={setTop}
    >
      <Background
        style={{
          "outline-color": windowInfo.color,
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
          "background-color": windowInfo.color,
        }}
      >
        <Header ref={headerRef!}>
          <HeaderTitle>{windowInfo.title}</HeaderTitle>
        </Header>
        <EditButton
          onClick={(e) => {
            open({
              x: e.pageX,
              y: e.pageY,
            });
          }}
        />
        <Popup>
          <EditPopup />
        </Popup>
        <MinimizeButton
          onClick={() => {
            setState("windows", index(), "minimized", true);
          }}
        />
        <CloseButton onClick={removeWindow} />
      </HeaderWrapper>
      <ContentWrapper>
        <ErrorBoundary fallback={<LoadingScreen />}>
          <WindowContent />
        </ErrorBoundary>
      </ContentWrapper>
    </Container>
  );
};

export default Window;
