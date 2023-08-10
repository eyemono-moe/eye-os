import { styled } from "@macaron-css/solid";
import {
  FaSolidMinus,
  FaSolidPlus,
  FaRegularTrashCan,
  FaSolidAlignCenter,
  FaSolidAlignLeft,
} from "solid-icons/fa";
import { type Component, Show, onMount } from "solid-js";
import { type SetStoreFunction } from "solid-js/store";

import { type WindowInfo } from "../../contexts/useWindows";
import { primitiveColors, semanticColors } from "../../theme/color";
import { fontFamily } from "../../theme/font";
import { type WindowData } from "../windows/WindowContent";
import { useWindow } from "../windows/Windows";

type Alignment = "center" | "left";

export interface NoteWindowData extends WindowData {
  type: "note";
  option: {
    content: string;
    alignment: Alignment;
    fontSize: number;
  };
}

export const defaultNoteWindowData: NoteWindowData = {
  type: "note",
  option: {
    content: "",
    alignment: "center",
    fontSize: 24,
  },
};

const Container = styled("div", {
  base: {
    width: "100%",
    height: "100%",
    position: "relative",
    background: semanticColors.ui.background,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
});

const TextArea = styled("div", {
  base: {
    width: "100%",
    resize: "none",
    border: "none",
    outline: "none",
    padding: "8px",
    fontFamily: fontFamily.mono,
    color: primitiveColors.white,
    userSelect: "text",
    backgroundColor: "transparent",
  },
});

const Buttons = styled("div", {
  base: {
    position: "absolute",
    top: "0",
    left: "0",
    display: "flex",
    flexDirection: "row",
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

const Note: Component = () => {
  const [state, { setState, index }] = useWindow() as [
    WindowInfo & NoteWindowData,
    {
      setState: SetStoreFunction<{
        windows: Array<WindowInfo & NoteWindowData>;
      }>;
      index: () => number;
    },
  ];

  if (state.type !== "note") {
    throw new Error("Invalid window type");
  }

  const increaseFontSize = () => {
    setState("windows", index(), "option", "fontSize", (s) => s + 4);
  };
  const decreaseFontSize = () => {
    setState("windows", index(), "option", "fontSize", (s) =>
      Math.max(s - 4, 16),
    );
  };
  const clearContent = () => {
    setState("windows", index(), "option", "content", "");
  };
  const toggleAlignment = () => {
    setState("windows", index(), "option", "alignment", (a) =>
      a === "center" ? "left" : "center",
    );
  };

  let ref: HTMLDivElement;
  onMount(() => {
    ref.innerText = state.option.content;
  });

  return (
    <Container>
      <Buttons>
        <Button onClick={increaseFontSize}>
          <FaSolidPlus fill={primitiveColors.gray[700]} size={24} />
        </Button>
        <Button onClick={decreaseFontSize}>
          <FaSolidMinus fill={primitiveColors.gray[700]} size={24} />
        </Button>
        <Button onClick={toggleAlignment}>
          <Show
            when={state.option.alignment === "center"}
            fallback={
              <FaSolidAlignLeft fill={primitiveColors.gray[700]} size={24} />
            }
          >
            <FaSolidAlignCenter fill={primitiveColors.gray[700]} size={24} />
          </Show>
        </Button>
        <Button onClick={clearContent}>
          <FaRegularTrashCan fill={primitiveColors.gray[700]} size={24} />
        </Button>
      </Buttons>
      <TextArea
        style={{
          "font-size": `${state.option.fontSize}px`,
          "text-align": state.option.alignment,
        }}
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ref={ref!}
        onInput={(e) => {
          setState(
            "windows",
            index(),
            "option",
            "content",
            e.currentTarget.innerText,
          );
        }}
        contentEditable
      />
    </Container>
  );
};

export default Note;
