import { ElementDefinition } from 'cytoscape';

export type NodeData = {
  id: string;
  name: string;
  score: number;
  parent?: string;
};

export type EdgeData = {
  id: number;
  source: number;
  target: number;
};

export type GraphNode = {
  data: NodeData;
};

export type GraphEdge = {
  data: EdgeData;
};

export type GraphData = {
  nodes: ElementDefinition[];
  edges: ElementDefinition[];
};
