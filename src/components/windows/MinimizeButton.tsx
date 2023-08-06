import { styled } from "@macaron-css/solid";
import { FaRegularWindowMinimize, FaSolidXmark } from "solid-icons/fa";
import { type Component } from "solid-js";

import { primitiveColors, semanticColors } from "../../theme/color";

const Container = styled("div", {
  base: {
    display: "flex",
    flexDirection: "row",
    cursor: "pointer",
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

const MinimizeButton: Component<{
  onClick: () => void;
}> = (props) => {
  return (
    <Container onClick={props.onClick}>
      <Button>
        <FaRegularWindowMinimize size={24} fill={semanticColors.text.white} />
      </Button>
      <Button>
        <FaSolidXmark size={24} fill={semanticColors.text.white} />
      </Button>
    </Container>
  );
};

export default MinimizeButton;
