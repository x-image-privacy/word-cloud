export type Rectangle = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Coordinate = {
  x: number;
  y: number;
};

export type Circle = {
  x: number;
  y: number;
  radius: number;
};

export type Word = {
  id: string;
  text: string;
  coef: number;
  rect?: Rectangle;
};

export type ExplanationData = { category: string; words: Word[] }[];
