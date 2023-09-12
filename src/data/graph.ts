import { ElementDefinition } from 'cytoscape';
import randomColor from 'randomcolor';

// import nodes from './genomic_nodes.json';
import edges from './prior_graph_edges.json';
// import nodes from './prior_graph_nodes.json';
import categories from './privacy_categories.json';
import nodes from './privacy_nodes.json';
import { GraphData, GraphNode, NodeData } from './types';

// const edges: ElementDefinition[] = [];

// const newNodes = nodes.map((node: GraphNode) => {
//   categories.forEach((category) => {
//     if (category.elements.includes(parseInt(node.data.id))) {
//       node.data.parent = category.id;
//     }
//   });
//   return node;
// });
// console.log(newNodes);

const coloredCategories = categories.map((category) => {
  return {
    data: {
      name: category.data.name,
      score: category.data.score,
      id: category.data.id.toString(),
      color: randomColor({
        luminosity: 'dark',
      }),
    },
  };
});

export function getElements(showCategories: Boolean): GraphData {
  if (showCategories) {
    return {
      nodes: [...nodes, ...coloredCategories],
      edges,
    };
  }
  return {
    nodes,
    edges,
  };
}

const elems: GraphData = {
  nodes: [...nodes, ...coloredCategories],
  // nodes,
  edges,
};

export default elems;
