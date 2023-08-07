import { styled } from "@macaron-css/solid";
import { FaSolidPlus } from "solid-icons/fa";
import { type Component } from "solid-js";

import { useWindows } from "../contexts/useWindows";
import generateWindowColor from "../lib/generateWindowColor";
import { primitiveColors } from "../theme/color";

const Container = styled("div", {
  base: {
    display: "grid",
    placeItems: "center",
    padding: "8px",
    cursor: "pointer",
    selectors: {
      "&:hover": {
        backgroundColor: primitiveColors.whiteAlpha[400],
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
          title: "📝 New Window",
          minimized: false,
          zIndex: state.windows.length - 1,
          topLeft: {
            x: 100,
            y: 100,
          },
          bottomRight: {
            x: 420,
            y: 280,
          },
          color: generateWindowColor(),
          type: "default",
        });
      }}
    >
      <FaSolidPlus fill={primitiveColors.white} size={24} />
    </Container>
  );
};

export default AddWindowButton;