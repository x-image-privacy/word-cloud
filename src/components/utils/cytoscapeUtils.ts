// todo: enable editing
// setCyHandle(cy);
// // remove all listeners
// cy.removeAllListeners();
// todo: enable edge drawing
// // @ts-ignore
// const eh = cy.edgehandles();
// eh.enable();
// const enableDrawingEdges = (event: KeyboardEvent) => {
//   console.log(event.shiftKey, event.code);
//   if (event.shiftKey && event.code === 'KeyD') {
//     const elem = cy.$('node:selected');
//     console.log(elem);
//     eh.start();
//   }
// };
// removeEventListener('keypress', enableDrawingEdges);
// addEventListener('keypress', enableDrawingEdges);
// todo: enable nesting
// const options = {
//   newParentNode: () => {
//     const parentColor = randomColor({
//       luminosity: 'dark',
//     });
//     const data = {
//       color: parentColor,
//       name: 'New Parent',
//       score: 0.5,
//     };
//     return { data };
//   },
// };
// // @ts-ignore
// const cdnd = cy.compoundDragAndDrop(options);
// cdnd.disable();
// cdnd.enable();
// todo: enable adding
// cy.removeListener('dblclick');
// cy.on('dblclick', function (event) {
//   if (event.target === cy) {
//     cy.add({
//       group: 'nodes',
//       data: {
//         id: randomColor(),
//         name: 'New Node',
//         score: 0.5,
//       },
//       position: event.position,
//     });
//   }
// });
// todo: enable removing
// cy.removeListener('cxttap');
// cy.on('cxttap', 'node', function (event) {
//   const ele = event.target;
//   if (ele !== cy) {
//     ele.remove();
//   }
// });
// cy.on('cxttap', 'edge', function (event) {
//   const ele = event.target;
//   if (ele !== cy) {
//     ele.remove();
//   }
// });
