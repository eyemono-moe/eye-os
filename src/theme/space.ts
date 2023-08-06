const base = 8;
const px = (value: number) => `${value}px`;

export const space = {
  "x0.5": px(0.5 * base),
  x1: px(base),
  x2: px(2 * base),
  x3: px(3 * base),
  x4: px(5 * base),
  x5: px(8 * base),
  x6: px(13 * base),
};
