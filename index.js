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
    return d[0] >= startDate && d[0] <= endDate;
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
  },
  lineColour: 'blue'
};

lineGraph.create(el, {
    width: '100%',
    height: '500px'
  }, state
);

/* virtual-dom stuff */
function render(price)  {
    return h('div', [String(price)]);
};

// function updateData(interval) {
//
// }

// var price = 0;
//
// var tree = render(price);
// var rootNode = createElement(tree);
// document.body.appendChild(rootNode);

dataFunc(function(data) {
  //now data has loaded, setup time
  var startDate = dateParse("20150901 000000");
  var endDate = dateParse("20150901 000200");
  var dateRange = dateFilter(startDate, endDate);
  var dataDateParsed = data.map(function(d){
    d[0] = dateParse(d[0]);
    return d;
  });
  //
  // setInterval(function () {
  //   var newEndDate = d3.time.minute.offset(endDate, 1);
  //   dateRange = dateFilter(startDate, newEndDate);
  //   // price++;
  //   //
  //   // var newTree = render(price);
  //   // var patches = diff(tree, newTree);
  //   // rootNode = patch(rootNode, patches);
  //   // tree = newTree;

    state.data = dateRange(dataDateParsed);
    state.domain = {
      x: d3.extent(dateRange(dataDateParsed).map(function (d) {
        return d[0];
      })),
      y: d3.extent(dateRange(dataDateParsed).map(function (d) {
        return d[1];
      }))
    };

    console.log(state.data)

    lineGraph.update(el, state);
  // }, 1000);
});
