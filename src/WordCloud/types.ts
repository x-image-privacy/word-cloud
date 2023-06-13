import { CategoryCloud } from "./components/types";

export type InputNode = {
  id: string;
  text: string;
  coef: number;
};

export type ExplanationData = CategoryCloud<InputNode, never>[];
