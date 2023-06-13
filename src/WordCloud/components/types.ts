import { InputNode } from "../types";

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

export type CategoryCloud<T, B> = { category: string; words: T[]; bound?: B };

export type Word = InputNode & { rect: Rectangle };
export type WordCloudData = CategoryCloud<Word, Rectangle>[];
