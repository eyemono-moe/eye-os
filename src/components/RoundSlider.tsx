import { type JSX, type Component, createMemo } from "solid-js";

import { primitiveColors } from "../theme/color";

interface Props {
  value: () => number;
  setter: (value: number) => void;
  min: number;
  max: number;
  startAngle: number;
  size: number;
  width: number;
}

const RoundSlider: Component<Props> = (props) => {
  const startRad = createMemo(() => (props.startAngle / 180) * Math.PI);
  const totalRad = createMemo(() => 2 * (Math.PI - startRad()));
  const valueToRad = (v: number) =>
    ((v - props.min) / (props.max - props.min)) * totalRad();

  const radToValue = (r: number) =>
    ((r - startRad()) / totalRad()) * (props.max - props.min) + props.min;

  const clip = (v: number) => {
    return Math.min(Math.max(v, props.min), props.max);
  };

  let ref: SVGSVGElement;

  const calcRad = (
    cursorPos: {
      x: number;
      y: number;
    },
    center: {
      x: number;
      y: number;
    },
  ) => {
    const x = cursorPos.x - center.x;
    const y = cursorPos.y - center.y;
    const rad = (Math.atan2(y, x) + (3 / 2) * Math.PI) % (2 * Math.PI);
    return rad;
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
    const rad = calcRad(cursorPosition, centerPosition);
    props.setter(clip(radToValue(rad)));
  };

  const handlePointerDown: JSX.EventHandlerUnion<
    SVGPathElement,
    PointerEvent
  > = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.addEventListener("pointermove", onPointerMove);
  };
  const handlePointerUp: JSX.EventHandlerUnion<SVGPathElement, PointerEvent> = (
    e,
  ) => {
    e.currentTarget.removeEventListener("pointermove", onPointerMove);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const svgPath = (endRad: number) => {
    const r = (props.size - props.width) / 2;

    const largeArcFlag = endRad > Math.PI ? 1 : 0;
    const sweepFlag = 1;

    const fx = props.size / 2 + r * Math.sin(endRad);
    const fy = props.size / 2 - r * Math.cos(endRad);

    return `M ${props.size / 2},${
      props.width / 2
    } A ${r},${r} 0 ${largeArcFlag} ${sweepFlag} ${fx},${fy}`;
  };

  return (
    <div
      style={{
        width: "100%",
        height: "auto",
        "aspect-ratio": "1",
      }}
    >
      <svg
        viewBox={`0 0 ${props.size} ${props.size}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: "100%",
          height: "100%",
        }}
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ref={ref!}
      >
        <path
          d={svgPath(totalRad())}
          stroke={primitiveColors.gray[800]}
          fill="none"
          stroke-width={props.width}
          stroke-linecap="round"
          transform={`rotate(${props.startAngle + 180} ${props.size / 2} ${
            props.size / 2
          })`}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          style={{
            cursor: "pointer",
          }}
        />
        <path
          d={svgPath(valueToRad(props.value()))}
          stroke={primitiveColors.pink[700]}
          fill="none"
          stroke-width={props.width * 0.75}
          stroke-linecap="round"
          transform={`rotate(${props.startAngle + 180} ${props.size / 2} ${
            props.size / 2
          })`}
          style={{
            "pointer-events": "none",
          }}
        />
        <circle
          r={props.width / 2}
          cx={
            props.size / 2 +
            ((props.size - props.width) / 2) *
              Math.sin(valueToRad(props.value()) + startRad() + Math.PI)
          }
          cy={
            props.size / 2 -
            ((props.size - props.width) / 2) *
              Math.cos(valueToRad(props.value()) + startRad() + Math.PI)
          }
          fill={primitiveColors.pink[400]}
          style={{
            "pointer-events": "none",
          }}
        />
      </svg>
    </div>
  );
};

export default RoundSlider;
