import { styled } from "@macaron-css/solid";
import { FaSolidPlus } from "solid-icons/fa";
import { type Component } from "solid-js";

import { useWindows } from "../contexts/useWindows";
import generateWindowColor from "../lib/generateWindowColor";
import { semanticColors } from "../theme/color";

const Container = styled("div", {
  base: {
    display: "grid",
    placeItems: "center",
    padding: "8px",
    cursor: "pointer",
    selectors: {
      "&:hover": {
        backgroundColor: semanticColors.ui.hoverWhite,
      },
    },
  },
});

const AddWindowButton: Component = () => {
  const [state, { addWindow }] = useWindows();

  return (
    <Container
      onClick={() => {
        addWindow({
          title: "New Window",
          icon: "📄",
          minimized: false,
          zIndex: state.windows.length - 1,
          x: 100,
          y: 100,
          width: 420,
          height: 280,
          color: generateWindowColor(),
          type: "empty",
        });
      }}
    >
      <FaSolidPlus fill={semanticColors.text.white} size={24} />
    </Container>
  );
};

export default AddWindowButton;
