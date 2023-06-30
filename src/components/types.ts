export type ExplainabilityNode = {
  id: string;
  name: string;
  score: number;
};

export type Category = {
  elements: string[];
} & ExplainabilityNode;
