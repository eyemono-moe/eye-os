import {
  offset,
  autoUpdate,
  flip,
  shift,
  type ReferenceElement,
} from "@floating-ui/dom";
import { styled } from "@macaron-css/solid";
import { useFloating } from "solid-floating-ui";
import {
  createSignal,
  onCleanup,
  onMount,
  type ParentComponent,
  Show,
} from "solid-js";
import { Portal } from "solid-js/web";

const ZIndexTop = styled("div", {
  base: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 999,
  },
});

const Background = styled("div", {
  base: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
});

const usePopup = (mount?: Node) => {
  const [baseElement, setBaseElement] = createSignal<ReferenceElement>();
  const [popupElement, setPopupElement] = createSignal<HTMLElement>();
  const [isOpen, setIsOpen] = createSignal(false);

  const position = useFloating(baseElement, popupElement, {
    whileElementsMounted: autoUpdate,
    placement: "bottom",
    middleware: [offset(6), flip(), shift({ padding: 5 })],
  });

  const open = () => {
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
        <Portal mount={mount}>
          <ZIndexTop>
            <Background onClick={close} />
            <div
              ref={setPopupElement}
              style={{
                position: position.strategy,
                top: `${position.y ?? 0}px`,
                left: `${position.x ?? 0}px`,
              }}
            >
              {props.children}
            </div>
          </ZIndexTop>
        </Portal>
      </Show>
    );
  };

  return {
    setBaseElement,
    open,
    close,
    Popup,
  };
};

export default usePopup;
