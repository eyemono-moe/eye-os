import { mix, primitiveColors } from "../theme/color";

const generateWindowColor = () => {
  const random1 = Math.floor(Math.random() * 100);
  return mix(primitiveColors.purple[400], primitiveColors.pink[400], random1);
};

export default generateWindowColor;
