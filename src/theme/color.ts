import chroma from "chroma-js";

// export const mix = (color1: string, color2: string, weight: number) => {
//   return `color-mix(in srgb, ${color1} ${weight}%, ${color2})`;
// };

export const mix = (color1: string, color2: string, weight: number) => {
  return chroma(color2)
    .mix(color1, weight / 100, "rgb")
    .hex();
};

const black = "#191E1E";
const white = "#ffffff";
const purple = "#CC33FF";
const green = "#C8FF33";
const pink = "#FF33B7";

export const primitiveColors = {
  black,
  blackAlpha: {
    50: `${black}0a`,
    100: `${black}0f`,
    200: `${black}14`,
    300: `${black}29`,
    400: `${black}3d`,
    500: `${black}5c`,
    600: `${black}7a`,
    700: `${black}a3`,
    800: `${black}cc`,
    900: `${black}eb`,
  },
  white,
  whiteAlpha: {
    50: `${white}0a`,
    100: `${white}0f`,
    200: `${white}14`,
    300: `${white}29`,
    400: `${white}3d`,
    500: `${white}5c`,
    600: `${white}7a`,
    700: `${white}a3`,
    800: `${white}cc`,
    900: `${white}eb`,
  },
  gray: {
    50: mix(black, white, 4),
    100: mix(black, white, 6),
    200: mix(black, white, 8),
    300: mix(black, white, 16),
    400: mix(black, white, 24),
    500: mix(black, white, 36),
    600: mix(black, white, 48),
    700: mix(black, white, 64),
    800: mix(black, white, 80),
    900: mix(black, white, 92),
  },
  purple: {
    50: mix(purple, white, 6),
    100: mix(purple, white, 24),
    200: mix(purple, white, 48),
    300: mix(purple, white, 80),
    400: purple,
    500: mix(black, purple, 16),
    600: mix(black, purple, 24),
    700: mix(black, purple, 36),
    800: mix(black, purple, 48),
    900: mix(black, purple, 64),
  },
  green: {
    50: mix(green, white, 6),
    100: mix(green, white, 24),
    200: mix(green, white, 48),
    300: mix(green, white, 80),
    400: green,
    500: mix(black, green, 16),
    600: mix(black, green, 24),
    700: mix(black, green, 36),
    800: mix(black, green, 48),
    900: mix(black, green, 64),
  },
  pink: {
    50: mix(pink, white, 6),
    100: mix(pink, white, 24),
    200: mix(pink, white, 48),
    300: mix(pink, white, 80),
    400: pink,
    500: mix(black, pink, 16),
    600: mix(black, pink, 24),
    700: mix(black, pink, 36),
    800: mix(black, pink, 48),
    900: mix(black, pink, 64),
  },
};

export const semanticColors = {
  accent: {
    primary: primitiveColors.purple[400],
    secondary: primitiveColors.green[400],
    tertiary: primitiveColors.pink[400],
  },
  text: {
    black: primitiveColors.black,
    gray: primitiveColors.gray[700],
    link: primitiveColors.purple[200],
    white: primitiveColors.white,
  },
  ui: {
    border: primitiveColors.gray[300],
    background: primitiveColors.green[400],
  },
};
