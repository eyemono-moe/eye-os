import { styled } from "@macaron-css/solid";
import { FaSolidMinus, FaSolidPlus, FaRegularTrashCan } from "solid-icons/fa";
import { createSignal, type Component } from "solid-js";

import { primitiveColors } from "../../theme/color";

const Container = styled("div", {
  base: {
    width: "100%",
    height: "100%",
    position: "relative",
    backgroundColor: primitiveColors.black,
    backgroundImage: `repeating-linear-gradient(-45deg, ${primitiveColors.gray[50]}, ${primitiveColors.gray[50]} 10px, transparent 0, transparent 20px)`,
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
    fontFamily: `'JetBrainsMono Nerd Font', 'Noto Sans JP Thin', monospace`,
    textAlign: "center",
    color: primitiveColors.pink[400],
    userSelect: "text",
  },
});

const Buttons = styled("div", {
  base: {
    position: "absolute",
    top: "0",
    right: "0",
    display: "flex",
    flexDirection: "row",
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
  const [fontSize, setFontSize] = createSignal(24);
  let noteRef: HTMLDivElement;
  const increaseFontSize = () => {
    setFontSize((s) => s + 4);
  };
  const decreaseFontSize = () => {
    setFontSize((s) => Math.max(s - 4, 16));
  };
  const clearContent = () => {
    noteRef.innerHTML = "";
  };

  return (
    <Container>
      <Buttons>
        <Button onClick={increaseFontSize}>
          <FaSolidPlus fill={primitiveColors.white} size={24} />
        </Button>
        <Button onClick={decreaseFontSize}>
          <FaSolidMinus fill={primitiveColors.white} size={24} />
        </Button>
        <Button onClick={clearContent}>
          <FaRegularTrashCan fill={primitiveColors.white} size={24} />
        </Button>
      </Buttons>
      <TextArea
        contentEditable
        style={{
          "font-size": `${fontSize()}px`,
        }}
        ref={noteRef!}
      />
    </Container>
  );
};

export default Note;
