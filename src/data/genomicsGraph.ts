import randomColor from 'randomcolor';

import categories from './genomic_categories.json';
import edges from './genomic_edges.json';
import nodes from './genomic_nodes.json';
import { GraphData } from './types';

// const newNodes = nodes.map((node: GraphNode) => {
//   categories.forEach((category) => {
//     if (category.elements.includes(node.data.id)) {
//       node.data.parent = category.id;
//     }
//   });
//   return node;
// });
// console.log(newNodes);

// const coloredNodes = categories.map((category) => {
//   return {
//     data: {
//       ...category,
//       elements: undefined,
//       color: randomColor({
//         luminosity: 'dark',
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
