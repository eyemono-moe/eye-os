import { styled } from "@macaron-css/solid";
import { type Component } from "solid-js";

const Container = styled("div", {
  base: {
    width: "100%",
    height: "100vh",
    overflow: "hidden",
    display: "flex",
    flexDirection: "row",
  },
});

const InfoCintainer: Component = () => {
  return <Container />;
};

export default InfoCintainer;
