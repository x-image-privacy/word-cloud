import { ElementDefinition } from 'cytoscape';
import randomColor from 'randomcolor';

import categories from './privacy_categories.json';
import edges from './privacy_edges.json';
import nodes from './privacy_nodes.json';
import { GraphData } from './types';

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

// const coloredNodes = nodes.map((category) => {
//   return {
//     data: {
//       ...category.data,
//       color: randomColor({
//         luminosity: 'dark',
//         hue: category.data.parent,
//       }),
//     },
//   };
// });
// console.log(coloredNodes);

const elems: GraphData = {
  nodes,
  edges,
  parentNodes: categories,
};

export default elems;
