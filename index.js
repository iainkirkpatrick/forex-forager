var h = require('virtual-dom/h');
var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');
var createElement = require('virtual-dom/create-element');

var lineGraph = require('./lineGraph');

lineGraph.create(document.body, {
    width: '100%',
    height: '500px'
  },
  {
    data: [],
    domain: {
      x: [0,1],
      y: [0,1]
    }
  }
)
/* virtual-dom stuff */
// function render(count)  {
//     return h('div', [String(count)]);
// };
//
// function createLineGraph() {
//   return
// }
//
// var count = 0;
//
// var tree = render(count);
// var rootNode = createElement(tree);
// document.body.appendChild(rootNode);

//updating
// setInterval(function () {
//       count++;
//
//       var newTree = render(count);
//       var patches = diff(tree, newTree);
//       rootNode = patch(rootNode, patches);
//       tree = newTree;
// }, 1000);
