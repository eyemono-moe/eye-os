/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { keyframes } from "@macaron-css/core";
import { styled } from "@macaron-css/solid";
import {
  createSignal,
  ErrorBoundary,
  onMount,
  type ParentComponent,
} from "solid-js";

import usePopup from "../../lib/usePopup";
import { primitiveColors } from "../../theme/color";

import CloseButton from "./CloseButton";
import EditButton from "./EditButton";
import EditPopup from "./EditPopup";
import EmojiButton from "./EmojiButton";
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

  const [offsetPosition, setOffsetPosition] = createSignal<{
    x: number;
    y: number;
  }>({
    x: 0,
    y: 0,
  });

  const handlePointerMoveOnLeft = (e: PointerEvent) => {
    let newX = e.pageX - offsetPosition().x;
    let newWidth = windowInfo.width + windowInfo.x - newX;
    if (newWidth < MIN_WIDTH) {
      newX = windowInfo.x + windowInfo.width - MIN_WIDTH;
      newWidth = MIN_WIDTH;
    }
    setState("windows", index(), "x", newX);
    setState("windows", index(), "width", newWidth);
  };

  const handlePointerMoveOnTop = (e: PointerEvent) => {
    let newY = e.pageY - offsetPosition().y;
    let newHeight = windowInfo.height + windowInfo.y - newY;
    if (newHeight < MIN_HEIGHT) {
      newY = windowInfo.y + windowInfo.height - MIN_HEIGHT;
      newHeight = MIN_HEIGHT;
    }
    setState("windows", index(), "y", newY);
    setState("windows", index(), "height", newHeight);
  };

  const handlePointerMoveOnRight = (e: PointerEvent) => {
    let newWidth = e.pageX - windowInfo.x - offsetPosition().x;
    if (newWidth < MIN_WIDTH) {
      newWidth = MIN_WIDTH;
    }
    setState("windows", index(), "width", newWidth);
  };

  const handlePointerMoveOnBottom = (e: PointerEvent) => {
    let newHeight = e.pageY - windowInfo.y - offsetPosition().y;
    if (newHeight < MIN_HEIGHT) {
      newHeight = MIN_HEIGHT;
    }
    setState("windows", index(), "height", newHeight);
  };

  const handleHeaderMove = (e: PointerEvent) => {
    const deltaX = e.pageX - windowInfo.x - offsetPosition().x - edgeWidth - 32;
    const deltaY = e.pageY - windowInfo.y - offsetPosition().y - edgeWidth;
    setState("windows", index(), "x", (p) => p + deltaX);
    setState("windows", index(), "y", (p) => p + deltaY);
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
        height: `${windowInfo.height}px`,
        left: `${windowInfo.x}px`,
        top: `${windowInfo.y}px`,
        width: `${windowInfo.width}px`,
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
        <EmojiButton />
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
