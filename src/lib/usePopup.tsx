import { styled } from "@macaron-css/solid";
import {
  type ParentComponent,
  Show,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import { Portal } from "solid-js/web";

const PopupWrapper = styled("div", {
  base: {
    position: "fixed",
  },
});

const usePopup = (mount?: Node) => {
  const [isOpen, setIsOpen] = createSignal(false);
  const [position, setPosition] = createSignal<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const open = (position: { x: number; y: number }) => {
    setPosition(position);
    setIsOpen(true);
  };
  const close = () => setIsOpen(false);

  // ESCキーでモーダルを閉じる
  const closeOnEsc = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      close();
    }
  };

  onMount(() => {
    document.addEventListener("keydown", closeOnEsc);
  });
  onCleanup(() => {
    document.removeEventListener("keydown", closeOnEsc);
  });

  const Popup: ParentComponent = (props) => {
    return (
      <Show when={isOpen()}>
        <Portal mount={mount != null ? mount : document.body}>
          <PopupWrapper
            style={{
              left: `${position().x}px`,
              top: `${position().y}px`,
            }}
          >
            {props.children}
          </PopupWrapper>
        </Portal>
      </Show>
    );
  };

  return {
    open,
    close,
    Popup,
  };
};

export default usePopup;
