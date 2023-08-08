import chroma from "chroma-js";

const generateWindowColor = () => {
  return chroma.hsl(Math.floor(Math.random() * 360), 0.9, 0.6).hex();
};

export default generateWindowColor;
