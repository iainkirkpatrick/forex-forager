var h = require('virtual-dom/h');
var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');
var createElement = require('virtual-dom/create-element');

var dataFunc = require('./data');
var lineGraph = require('./lineGraph');
var d3 = require('d3');


var el = document.body;
var state = {
  data: [],
  domain: {
    x: [0,1],
    y: [0,1]
  }
};

lineGraph.create(el, {
    width: '100%',
    height: '500px'
  }, state
);

dataFunc(function(data) {
  state.data = data;
  state.domain = {
    x: d3.extent(data.map(function (d) {
        var dateParse = d3.time.format("%Y%m%d %H%M%S").parse;
        //console.log(dateParse(d[0]));
        //console.log(dateParse(d[0].split(' ')[0]));
        return dateParse(d[0]);
    })),
    y: d3.extent(data.map(function (d) {
        return d[1];
    }))
  };
  console.log(state.domain);
  lineGraph.update(el, state);
});
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
