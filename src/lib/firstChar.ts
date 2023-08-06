const firstChar = (str: string) => {
  const segmenter = new Intl.Segmenter("ja", { granularity: "grapheme" });
  const segments = segmenter.segment(str);
  return Array.from(segments)[0].segment;
};

export default firstChar;
