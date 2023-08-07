import { styled } from "@macaron-css/solid";
import { EmojiPicker } from "solid-emoji-picker";
import { Suspense, type Component, createSignal } from "solid-js";

import usePopup from "../../lib/usePopup";
import { primitiveColors } from "../../theme/color";
import "../../theme/emojiPicker.css";

import { useWindow } from "./Windows";

const Container = styled("div", {
  base: {
    display: "flex",
    flexDirection: "row",
    cursor: "pointer",
  },
});

const PopupContainer = styled("div", {
  base: {
    width: "600px",
    height: "800px",
    backgroundColor: primitiveColors.black,
    borderRadius: "8px",
    padding: "8px",
  },
});

const PickerContainer = styled("div", {
  base: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
});

const StampFilter = styled("input", {
  base: {
    width: "100%",
    height: "32px",
  },
});

const Button = styled("div", {
  base: {
    width: "32px",
    height: "32px",
    fontSize: "18px",
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

const EmojiButton: Component = () => {
  const [filter, setFilter] = createSignal("");

  const [state, { setState, index }] = useWindow();
  const { Popup, open, close } = usePopup();

  return (
    <Container>
      <Button
        onClick={(e) => {
          open({
            x: e.clientX,
            y: e.clientY,
          });
        }}
      >
        {state.icon}
      </Button>
      <Popup>
        <PopupContainer>
          <Suspense fallback={<div>Loading...</div>}>
            <PickerContainer>
              <StampFilter
                type="text"
                value={filter()}
                onInput={(e) => {
                  setFilter(e.target.value);
                }}
              />
              <EmojiPicker
                onEmojiClick={(emoji) => {
                  setState("windows", index(), "icon", emoji.emoji);
                  close();
                }}
                filter={(emoji) => {
                  return emoji.name.includes(filter());
                }}
              />
            </PickerContainer>
          </Suspense>
        </PopupContainer>
      </Popup>
    </Container>
  );
};

export default EmojiButton;
