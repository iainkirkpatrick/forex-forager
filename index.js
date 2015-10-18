var h = require('virtual-dom/h');
var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');
var createElement = require('virtual-dom/create-element');

var dataFunc = require('./data');
var lineGraph = require('./lineGraph');
var d3 = require('d3');
var R = require('ramda');

var dateParse = d3.time.format("%Y%m%d %H%M%S").parse;
var dateFilter = R.curry(function(startDate, endDate, data) {
  return data.filter(function(d){
    //console.log(d[0], startDate, endDate)
    return d[0] > startDate && d[0] < endDate;
  });
});
// var dateFilter = R.filter(function(d) {
//
// })


var el = document.body;
var state = {
  data: [],
  domain: {
    x: [0,1],
    y: [0,1]
  }
};
var sep1 = dateFilter(dateParse("20150901 000000"), dateParse("20150901 235900"));

lineGraph.create(el, {
    width: '100%',
    height: '500px'
  }, state
);

dataFunc(function(data) {
  var dataDateParsed = data.map(function(d){
    d[0] = dateParse(d[0]);
    return d;
  });

  state.data = sep1(dataDateParsed);
  state.domain = {
    x: d3.extent(sep1(dataDateParsed).map(function (d) {
      return d[0];
    })),
    y: d3.extent(sep1(dataDateParsed).map(function (d) {
      return d[1];
    }))
  };

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
