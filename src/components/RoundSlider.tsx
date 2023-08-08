import { styled } from "@macaron-css/solid";
import { type JSX, type Component } from "solid-js";

import { primitiveColors } from "../theme/color";

interface Props {
  value: () => number;
  setter: (value: number) => void;
  min: number;
  max: number;
  step: number;
  startAngle: number;
}

const Output = styled("output", {
  base: {
    position: "absolute",
    top: "0",
    left: "50%",
    transformOrigin: "bottom",
    width: "16px",
    height: "50%",
    selectors: {
      "&::before": {
        content: "''",
        position: "absolute",
        top: "0",
        left: "50%",
        transform: "translateX(-50%)",
        width: "32px",
        height: "32px",
        background: primitiveColors.pink[400],
        borderRadius: "50%",
      },
    },
  },
});

const Slider = styled("div", {
  base: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    overflow: "hidden",
  },
});

const RoundSlider: Component<Props> = (props) => {
  const totalAngle = 2 * (180 - props.startAngle);
  const vtoa = (v: number) =>
    ((v - props.min) / (props.max - props.min)) * totalAngle + props.startAngle;

  const atov = (a: number) =>
    ((a - props.startAngle) / totalAngle) * (props.max - props.min) + props.min;

  const clip = (v: number) => {
    return Math.min(Math.max(v, props.min), props.max);
  };

  let ref: HTMLDivElement;

  const calcAngle = (
    corsorPos: {
      x: number;
      y: number;
    },
    center: {
      x: number;
      y: number;
    },
  ) => {
    const x = corsorPos.x - center.x;
    const y = corsorPos.y - center.y;
    const angle = Math.atan2(y, x) * (180 / Math.PI) + 270;
    return angle % 360;
  };

  const center = () => {
    const rect = ref.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  };
  const onPointerMove = (e: PointerEvent) => {
    const cursorPosition = {
      x: e.clientX,
      y: e.clientY,
    };
    const centerPosition = center();
    const angle = calcAngle(cursorPosition, centerPosition);
    props.setter(clip(atov(angle)));
  };
  const handlePointerDown: JSX.EventHandlerUnion<HTMLElement, PointerEvent> = (
    e,
  ) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.addEventListener("pointermove", onPointerMove);
  };
  const handlePointerUp: JSX.EventHandlerUnion<HTMLElement, PointerEvent> = (
    e,
  ) => {
    e.currentTarget.removeEventListener("pointermove", onPointerMove);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <>
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "auto",
          "aspect-ratio": "1",
          transform: "rotate(180deg)",
        }}
      >
        <Slider
          style={{
            "background-image": `conic-gradient(transparent 0deg, transparent ${
              props.startAngle
            }deg, ${primitiveColors.pink[900]} ${props.startAngle}deg, ${
              primitiveColors.pink[900]
            } ${vtoa(props.value())}deg, ${primitiveColors.gray[900]} ${vtoa(
              props.value(),
            )}deg, ${primitiveColors.gray[900]} ${
              360 - props.startAngle
            }deg, transparent ${360 - props.startAngle}deg)`,
          }}
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          ref={ref!}
        />
        <Output
          style={{
            transform: `translateX(-50%) rotate(${vtoa(props.value())}deg)`,
          }}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
        />
      </div>
    </>
  );
};

export default RoundSlider;
