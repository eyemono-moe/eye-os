import { keyframes } from "@macaron-css/core";
import { styled } from "@macaron-css/solid";
import { type Component } from "solid-js";

import { semanticColors } from "../theme/color";
import { fontFamily } from "../theme/font";

const Container = styled("div", {
  base: {
    height: "fit-content",
    display: "grid",
    placeContent: "center",
    fontFamily: fontFamily.raglanPunch,
  },
});

const BackgroundImage = styled("svg", {
  base: {
    gridArea: "1 / 1 / 1 / 1",
    alignSelf: "center",
  },
});

const NamesContainer = styled("div", {
  base: {
    gridArea: "1 / 1 / 1 / 1",
    width: "100%",
    display: "grid",
    alignSelf: "center",
    placeContent: "center",
    placeItems: "end",
    gap: "8px",
  },
});

const Names = styled("div", {
  base: {
    display: "grid",
  },
});

const Name = styled("div", {
  base: {
    position: "relative",
    gridArea: "1 / 1 / 1 / 1",
    fontSize: "84px",
    fontStyle: "normal",
    fontWeight: 900,
    lineHeight: "100%",
    mixBlendMode: "screen",
  },
  variants: {
    small: {
      true: {
        fontSize: "32px",
      },
    },
  },
});

const slide = keyframes({
  "0%": { transform: "rotate(-13deg) translate(-482px, 145px)" },
  "100%": { transform: "rotate(-13deg) translate(-964px, 145px)" },
});

const NamePlate: Component = () => {
  return (
    <Container>
      <BackgroundImage
        xmlns="http://www.w3.org/2000/svg"
        width="461"
        height="174"
        viewBox="0 0 461 174"
        fill="none"
      >
        <path
          d="M0 151.311L18.7022 23.5001L460.702 0.00012207L435.882 173.297L0 151.311Z"
          fill="#191E1E"
        />
        <text
          style={{
            "font-size": "57px",
            "font-style": "normal",
            "font-weight": 900,
            "line-height": "normal",
            stroke: "#C8FF33",
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            animation: `${slide} 10s linear infinite`,
          }}
        >
          {"eyemono.moe eyemono.moe eyemono.moe eyemono.moe"}
        </text>
      </BackgroundImage>
      <NamesContainer>
        <Names>
          <Name
            style={{
              top: "0px",
              left: "0px",
              color: semanticColors.accent.primary,
            }}
          >
            四十物 萌
          </Name>
          <Name
            style={{
              top: "2px",
              left: "-2px",
              color: semanticColors.accent.secondary,
            }}
          >
            四十物 萌
          </Name>
          <Name
            style={{
              top: "4px",
              left: "2px",
              color: semanticColors.accent.tertiary,
            }}
          >
            四十物 萌
          </Name>
        </Names>
        <Names>
          <Name
            small
            style={{
              top: "0px",
              left: "0px",
              color: semanticColors.accent.primary,
            }}
          >
            アイモノ モエ
          </Name>
          <Name
            small
            style={{
              top: "1px",
              left: "-1px",
              color: semanticColors.accent.secondary,
            }}
          >
            アイモノ モエ
          </Name>
          <Name
            small
            style={{
              top: "2px",
              left: "2px",
              color: semanticColors.accent.tertiary,
            }}
          >
            アイモノ モエ
          </Name>
        </Names>
      </NamesContainer>
    </Container>
  );
};

export default NamePlate;
