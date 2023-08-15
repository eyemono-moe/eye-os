/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { keyframes } from "@macaron-css/core";
import { styled } from "@macaron-css/solid";
import {
  FaRegularWindowMaximize,
  FaRegularWindowMinimize,
  FaRegularWindowRestore,
  FaSolidBars,
  FaSolidXmark,
} from "solid-icons/fa";
import { onMount, createEffect, type Component, Show } from "solid-js";

import { MAIN_SCENE_NAME } from "../../consts";
import usePopup from "../../lib/usePopup";
import useSceneItemTransform from "../../lib/useSceneItemTransform";
import { primitiveColors, semanticColors } from "../../theme/color";
import { useWindow } from "../Windows";

import HeaderButton from "./HeaderButton";
import IconEditor from "./IconEditor";
import WindowContent from "./WindowContent";
import WindowDataEditor from "./WindowDataEditor";

const headerHeight = 36;
const movableEdgeWidth = 8;
const displayEdgeWidth = 4;

const MIN_WIDTH = 32 * 5 + displayEdgeWidth * 2;
const MIN_HEIGHT = 100;

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
    animationDuration: "0.5s",
    animationIterationCount: 1,
    animationFillMode: "forwards",
    pointerEvents: "auto",
  },
  variants: {
    maximized: {
      true: {
        left: "0 !important",
        top: "0 !important",
        width: "100% !important",
        height: "100% !important",
      },
    },
  },
});

const Edges = styled("div", {
  base: {
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    display: "grid",
    gridTemplateColumns: `${movableEdgeWidth}px 1fr ${movableEdgeWidth}px`,
    gridTemplateRows: `${movableEdgeWidth}px 1fr ${movableEdgeWidth}px`,
    pointerEvents: "none",
  },
});

const Edge = styled("div", {
  base: {
    pointerEvents: "auto",
  },
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
        gridRow: "2 / 3",
        cursor: "ew-resize",
      },
      right: {
        gridColumn: "3 / 4",
        gridRow: "2 / 3",
        cursor: "ew-resize",
      },
      bottomLeft: {
        gridColumn: "1 / 2",
        gridRow: "3 / 4",
        cursor: "nesw-resize",
      },
      bottom: {
        gridColumn: "2 / 3",
        gridRow: "3 / 4",
        cursor: "ns-resize",
      },
      bottomRight: {
        gridColumn: "3 / 4",
        gridRow: "3 / 4",
        cursor: "nwse-resize",
      },
    },
  },
});

const Content = styled("div", {
  base: {
    position: "absolute",
    left: "0",
    top: "0",
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",

    borderWidth: `${displayEdgeWidth}px`,
    borderStyle: "solid",
    borderRadius: "8px",
    outline: `solid 1px ${primitiveColors.blackAlpha[600]}`,
    boxShadow: `4px 4px 12px 2px ${primitiveColors.blackAlpha[400]}`,
  },
  variants: {
    maximized: {
      true: {
        borderRadius: "0",
        outline: "none",
        boxShadow: "none",
      },
    },
  },
});

const Header = styled("div", {
  base: {
    width: "100%",
    height: "auto",
    display: "flex",
  },
});

const HeaderTitle = styled("div", {
  base: {
    width: "100%",
    height: "32px",
    cursor: "move",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",

    fontSize: "18px",
    lineHeight: "32px",
    fontWeight: "bold",
    color: primitiveColors.white,
  },
});

const HeaderButtons = styled("div", {
  base: {
    width: "auto",
    height: "auto",
    display: "flex",
  },
});

const Body = styled("div", {
  base: {
    position: "relative",
    width: "100%",
    overflow: "hidden",
    flexGrow: 1,
    background: semanticColors.ui.background,
  },
});

const ContentWrapper = styled("div", {
  base: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
});

const Window: Component = () => {
  let windowMoverRef: HTMLDivElement;
  let topLeftRef: HTMLDivElement;
  let topRef: HTMLDivElement;
  let topRightRef: HTMLDivElement;
  let leftRef: HTMLDivElement;
  let rightRef: HTMLDivElement;
  let bottomLeftRef: HTMLDivElement;
  let bottomRef: HTMLDivElement;
  let bottomRightRef: HTMLDivElement;
  let windowBodyRef: HTMLDivElement;
  let windowContentRef: HTMLDivElement;

  const [windowInfo, { setState, setTop, removeWindow, index }] = useWindow()!;

  const minimizeWindow = () => {
    setState("windows", index(), "minimized", true);
  };
  const toggleMaximize = () => {
    setState("windows", index(), "maximized", (m) => !m);
  };
  const restoreWindow = () => {
    setState("windows", index(), "maximized", false);
  };

  const {
    Popup: IconEditorPopup,
    open: openIconEditor,
    setBaseElement: setIconEditorBaseElement,
  } = usePopup();

  const {
    Popup: WindowEditorPopup,
    open: openEditor,
    setBaseElement: setEditorBaseElement,
  } = usePopup();

  let offsetPosition = {
    x: 0,
    y: 0,
  };
  let leftTopOffsetPosition = {
    x: 0,
    y: 0,
  };

  const { transform, setTransform } = useSceneItemTransform(
    MAIN_SCENE_NAME,
    () => windowInfo.linkSceneItemId ?? -1,
  );

  const bodyWidth = () => windowBodyRef.getBoundingClientRect().width;
  const bodyHeight = () => windowBodyRef.getBoundingClientRect().height;

  const keepAspectHeight = () => {
    if (
      windowInfo.linkSceneItemId !== undefined &&
      transform.state === "ready"
    ) {
      const scale =
        bodyWidth() /
        ((transform()?.sourceWidth as number | null | undefined) ?? 100);
      setState(
        "windows",
        index(),
        "height",
        scale *
          ((transform()?.sourceHeight as number | null | undefined) ?? 100) +
          displayEdgeWidth +
          headerHeight,
      );
    }
  };

  const keepAspectWidth = () => {
    if (
      windowInfo.linkSceneItemId !== undefined &&
      transform.state === "ready"
    ) {
      const scale =
        bodyHeight() /
        ((transform()?.sourceHeight as number | null | undefined) ?? 100);
      setState(
        "windows",
        index(),
        "width",
        scale *
          ((transform()?.sourceWidth as number | null | undefined) ?? 100) +
          displayEdgeWidth * 2,
      );
    }
  };

  // eslint-disable-next-line solid/reactivity
  createEffect(async () => {
    // ウィンドウの配置が変化したらOBS側のシーンアイテムの位置を更新する
    void windowInfo.x;
    void windowInfo.y;
    void windowInfo.width;
    void windowInfo.height;

    if (
      windowInfo.linkSceneItemId !== undefined &&
      transform.state === "ready"
    ) {
      const displayedRect = windowBodyRef.getBoundingClientRect();
      const scale =
        displayedRect.width /
        ((transform()?.sourceWidth as number | null | undefined) ?? 100);
      await setTransform({
        positionX: displayedRect.x,
        positionY: displayedRect.y,
        scaleX: scale,
        scaleY: scale,
      });
    }
  });

  createEffect(keepAspectHeight);

  const handlePointerMoveOnLeft = (e: PointerEvent) => {
    let newX = e.pageX - offsetPosition.x;
    let newWidth = windowInfo.width + windowInfo.x - newX;
    if (newWidth < MIN_WIDTH) {
      newX = windowInfo.x + windowInfo.width - MIN_WIDTH;
      newWidth = MIN_WIDTH;
    }
    setState("windows", index(), "x", newX);
    setState("windows", index(), "width", newWidth);
    keepAspectHeight();
  };

  const handlePointerMoveOnTop = (e: PointerEvent) => {
    let newY = e.pageY - offsetPosition.y;
    let newHeight = windowInfo.height + windowInfo.y - newY;
    if (newHeight < MIN_HEIGHT) {
      newY = windowInfo.y + windowInfo.height - MIN_HEIGHT;
      newHeight = MIN_HEIGHT;
    }
    setState("windows", index(), "y", newY);
    setState("windows", index(), "height", newHeight);
    keepAspectWidth();
  };

  const handlePointerMoveOnRight = (e: PointerEvent) => {
    let newWidth = e.pageX - windowInfo.x - offsetPosition.x + movableEdgeWidth;
    if (newWidth < MIN_WIDTH) {
      newWidth = MIN_WIDTH;
    }
    setState("windows", index(), "width", newWidth);
    keepAspectHeight();
  };

  const handlePointerMoveOnBottom = (e: PointerEvent) => {
    let newHeight =
      e.pageY - windowInfo.y - offsetPosition.y + movableEdgeWidth;
    if (newHeight < MIN_HEIGHT) {
      newHeight = MIN_HEIGHT;
    }
    setState("windows", index(), "height", newHeight);
    keepAspectWidth();
  };

  const handleHeaderMove = (e: PointerEvent) => {
    if (windowInfo.maximized) {
      restoreWindow();
    }
    const deltaX = e.pageX - windowInfo.x - leftTopOffsetPosition.x;
    const deltaY = e.pageY - windowInfo.y - leftTopOffsetPosition.y;
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
      offsetPosition = {
        x: e.offsetX,
        y: e.offsetY,
      };
      leftTopOffsetPosition = {
        x: e.pageX - windowContentRef.getBoundingClientRect().x,
        y: e.pageY - windowContentRef.getBoundingClientRect().y,
      };
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      ref.addEventListener("pointermove", pointerMoveHandler);
      ref.addEventListener(
        "pointerup",
        (e: PointerEvent) => {
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
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

    handlePointerDown(windowMoverRef, handleHeaderMove);
    windowMoverRef.addEventListener("pointerdown", (e) => {
      if (windowInfo.maximized) {
        leftTopOffsetPosition = {
          x: windowInfo.width / 2,
          y: e.pageY,
        };
      }
    });
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
      ref={windowContentRef!}
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onPointerDown={setTop}
      maximized={windowInfo.maximized}
    >
      <Content
        style={{
          "border-color": windowInfo.color,
        }}
        maximized={windowInfo.maximized}
      >
        <Header
          style={{
            "background-color": windowInfo.color,
          }}
        >
          <HeaderButton
            ref={setIconEditorBaseElement}
            onClick={openIconEditor}
            style={{
              "font-size": "20px",
            }}
          >
            {windowInfo.icon}
          </HeaderButton>
          <IconEditorPopup>
            <IconEditor />
          </IconEditorPopup>
          <HeaderTitle ref={windowMoverRef!}>{windowInfo.title}</HeaderTitle>
          <HeaderButtons>
            <HeaderButton ref={setEditorBaseElement} onClick={openEditor}>
              <FaSolidBars size={24} fill={semanticColors.text.white} />
            </HeaderButton>
            <WindowEditorPopup>
              <WindowDataEditor />
            </WindowEditorPopup>
            <HeaderButton onClick={minimizeWindow}>
              <FaRegularWindowMinimize
                size={24}
                fill={semanticColors.text.white}
              />
            </HeaderButton>
            <HeaderButton onClick={toggleMaximize}>
              <Show
                when={windowInfo.maximized}
                fallback={
                  <FaRegularWindowMaximize
                    size={24}
                    fill={semanticColors.text.white}
                  />
                }
              >
                <FaRegularWindowRestore
                  size={24}
                  fill={semanticColors.text.white}
                />
              </Show>
            </HeaderButton>
            <HeaderButton onClick={removeWindow} closeButton>
              <FaSolidXmark size={24} fill={semanticColors.text.white} />
            </HeaderButton>
          </HeaderButtons>
        </Header>
        <Body ref={windowBodyRef!}>
          <WindowContent />
        </Body>
      </Content>
      <Edges>
        <Edge ref={topLeftRef!} direction="topLeft" />
        <Edge ref={topRef!} direction="top" />
        <Edge ref={topRightRef!} direction="topRight" />
        <Edge ref={leftRef!} direction="left" />
        <Edge ref={rightRef!} direction="right" />
        <Edge ref={bottomLeftRef!} direction="bottomLeft" />
        <Edge ref={bottomRef!} direction="bottom" />
        <Edge ref={bottomRightRef!} direction="bottomRight" />
      </Edges>
    </Container>
  );
};

export default Window;
