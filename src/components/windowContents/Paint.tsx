import { styled } from "@macaron-css/solid";
import {
  FaRegularTrashCan,
  FaSolidEraser,
  FaSolidPencil,
} from "solid-icons/fa";
import {
  onMount,
  type Component,
  createSignal,
  createEffect,
  on,
} from "solid-js";

import usePopup from "../../lib/usePopup";
import { primitiveColors } from "../../theme/color";
import UIButton from "../UI/UIButton";
import UIColorInput from "../UI/UIColorInput";
import { type WindowData } from "../window/WindowContent";

export interface PaintWindowData extends WindowData {
  type: "paint";
}

export const defaultPaintWindowData: PaintWindowData = {
  type: "paint",
};

const Container = styled("div", {
  base: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
});

const ToolHeaderContainer = styled("div", {
  base: {
    flexShrink: 0,
    width: "100%",
    height: "auto",
    padding: "2px 4px",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: "4px",
    backgroundColor: primitiveColors.gray[500],
  },
});

const CanvasWrapper = styled("div", {
  base: {
    width: "100%",
    height: "100%",
    backgroundColor: "#ffffff",
    overflow: "hidden",
    cursor: "crosshair",
  },
});

const ColorSelector = styled("button", {
  base: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    selectors: {
      "&:hover": {
        opacity: "0.8",
      },
    },
  },
});

const ToolRadio = styled("input", {
  base: {
    display: "none",
  },
});

const Button = styled("div", {
  base: {
    width: "32px",
    height: "32px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "4px",
    cursor: "pointer",
    selectors: {
      "&:hover": {
        backgroundColor: primitiveColors.whiteAlpha[400],
      },
      'input[type="radio"]:checked + &': {
        backgroundColor: primitiveColors.whiteAlpha[800],
      },
    },
  },
});

const WidthDisplayContainer = styled("div", {
  base: {
    width: "32px",
    height: "32px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

const WidthDisplay = styled("div", {
  base: {
    aspectRatio: "1/1",
    border: "1px solid",
    borderColor: primitiveColors.gray[800],
    borderRadius: "50%",
  },
});

const ClearDialogContainer = styled("div", {
  base: {
    padding: "8px",
    backgroundColor: primitiveColors.black,
    borderRadius: "8px",

    border: "1px solid",
    borderColor: primitiveColors.gray[800],
    boxShadow: `4px 4px 12px 2px ${primitiveColors.blackAlpha[400]}`,

    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "4px",
  },
});

const ClearButtons = styled("div", {
  base: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "4px",
  },
});

const Paint: Component = () => {
  let canvasWrapper: HTMLDivElement;
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  const [width, setWidth] = createSignal(8);
  const [mode, setMode] = createSignal<"pen" | "eraser">("pen");
  const [color, setColor] = createSignal(primitiveColors.black);

  const changeColor = (color: string) => {
    setColor(color);
    setMode("pen");
  };

  const {
    Popup: ClearDialog,
    open: openClearDialog,
    close: closeClearDialog,
    setBaseElement,
  } = usePopup();

  let dragging = false;
  let prevPointerPosition = { x: 0, y: 0 };

  const resizeCanvas: ResizeObserverCallback = (entries) => {
    const oldImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { blockSize: height, inlineSize: width } =
      entries[0].borderBoxSize[0];
    canvas.width = width;
    canvas.height = height;

    // reset context
    // canvasのサイズが変わるとcontextがリセットされるので再設定する
    setContext();

    // reset canvas
    clearCanvas();

    // restore image
    ctx.putImageData(oldImageData, 0, 0);
  };

  const clearCanvas = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const setContext = () => {
    if (ctx === undefined) return;
    ctx.lineWidth = width();
    ctx.strokeStyle = color();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalCompositeOperation =
      mode() === "pen" ? "source-over" : "destination-out";
  };

  createEffect(
    on([width, color, mode], () => {
      setContext();
    }),
  );

  const onPointerDown = (e: PointerEvent) => {
    // 左クリック以外は無視
    if (e.button !== 0) return;
    if (dragging) return;
    dragging = true;
    canvas.setPointerCapture(e.pointerId);

    prevPointerPosition = { x: e.offsetX, y: e.offsetY };
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!dragging) return;
    const pointerPosition = { x: e.offsetX, y: e.offsetY };

    ctx.beginPath();
    ctx.moveTo(prevPointerPosition.x, prevPointerPosition.y);
    ctx.lineTo(pointerPosition.x, pointerPosition.y);
    ctx.closePath();
    ctx.stroke();

    prevPointerPosition = pointerPosition;
  };

  const onPointerUp = (e: PointerEvent) => {
    if (!dragging) return;
    dragging = false;
    canvas.releasePointerCapture(e.pointerId);
    const pointerPosition = { x: e.offsetX, y: e.offsetY };

    ctx.beginPath();
    ctx.moveTo(prevPointerPosition.x, prevPointerPosition.y);
    ctx.lineTo(pointerPosition.x, pointerPosition.y);
    ctx.closePath();
    ctx.stroke();
  };

  onMount(() => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    ctx = canvas.getContext("2d", {
      willReadFrequently: true,
    })!;

    clearCanvas();

    // observe canvasWrapper size
    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(canvasWrapper);

    // add event listeners
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
  });

  return (
    <Container>
      <ToolHeaderContainer>
        <ColorSelector
          style={{
            "background-color": primitiveColors.black,
          }}
          onClick={() => {
            changeColor(primitiveColors.black);
          }}
        />
        <ColorSelector
          style={{
            "background-color": primitiveColors.green[400],
          }}
          onClick={() => {
            changeColor(primitiveColors.green[400]);
          }}
        />
        <ColorSelector
          style={{
            "background-color": primitiveColors.pink[400],
          }}
          onClick={() => {
            changeColor(primitiveColors.pink[400]);
          }}
        />
        <ColorSelector
          style={{
            "background-color": primitiveColors.purple[400],
          }}
          onClick={() => {
            changeColor(primitiveColors.purple[400]);
          }}
        />
        <UIColorInput
          type="color"
          value={color()}
          onInput={(e) => {
            changeColor(e.currentTarget.value);
          }}
          style={{
            width: "32px",
            height: "32px",
          }}
        />
        <input
          type="range"
          value={width()}
          min={1}
          max={24}
          onInput={(e) => {
            setWidth(e.currentTarget.valueAsNumber);
          }}
        />
        <WidthDisplayContainer>
          <WidthDisplay
            style={{
              width: `${width()}px`,
            }}
          />
        </WidthDisplayContainer>
        <label>
          <ToolRadio
            type="radio"
            name="tool"
            value="pen"
            checked={mode() === "pen"}
          />
          <Button
            onClick={() => {
              setMode("pen");
            }}
          >
            <FaSolidPencil fill={primitiveColors.gray[700]} size={24} />
          </Button>
        </label>
        <label>
          <ToolRadio
            type="radio"
            name="tool"
            value="eraser"
            checked={mode() === "eraser"}
          />
          <Button
            onClick={() => {
              setMode("eraser");
            }}
          >
            <FaSolidEraser fill={primitiveColors.gray[700]} size={24} />
          </Button>
        </label>
        <Button onClick={openClearDialog} ref={setBaseElement}>
          <FaRegularTrashCan fill={primitiveColors.gray[700]} size={24} />
        </Button>
        <ClearDialog>
          <ClearDialogContainer>
            <p>Are you sure you want to clear the canvas?</p>
            <ClearButtons>
              <UIButton onClick={closeClearDialog}>cancel</UIButton>
              <UIButton
                danger
                onClick={() => {
                  clearCanvas();
                  closeClearDialog();
                }}
              >
                clear
              </UIButton>
            </ClearButtons>
          </ClearDialogContainer>
        </ClearDialog>
      </ToolHeaderContainer>
      {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
      <CanvasWrapper ref={canvasWrapper!}>
        {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
        <canvas ref={canvas!} />
      </CanvasWrapper>
    </Container>
  );
};

export default Paint;
