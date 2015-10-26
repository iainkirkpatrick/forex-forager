var h = require('virtual-dom/h');
var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');
var createElement = require('virtual-dom/create-element');

const atom = require('state-atom')

// var dataFunc = require('./data');
// var lineGraph = require('./lineGraph');
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

//state
// var state = require('./state');
// console.log(state());


var el = document.body;
// var state = {
//   data: [],
//   domain: {
//     x: [0,1],
//     y: [0,1]
//   },
//   lineColour: 'blue'
// };
//
// lineGraph.create(el, {
//     width: '100%',
//     height: '500px'
//   }, state
// );

/* INPUT */
//here be a list of events


/* STATE */
//here be state: a single state atom and logic to update it when events occur
var stateAtom = atom({
  balance: atom.value(),
  currentPrice: atom.value(),
  position: atom.value(),
  floor: atom.value(),
  ceiling: atom.value(),
  graph: {
    data: atom.array([]),
    domain: atom.struct({
      x: atom.array([atom.value(0),atom.value(1)]),
      y: atom.array([atom.value(0),atom.value(1)])
    }),
    lineColour: atom.value('blue')
  }
});

// stateAtom(function(state) {
//   //what do when state change?
//   console.log(state.balance);
// });
//
// stateAtom.balance.set(23);

/* RENDER */
//here be rendering logic: a single function that takes the state and returns our UI
function render(state)  {
    return h('div', [
      h('span', "Balance: " + String(state.balance))
    ]);
};

var tree = render(stateAtom());
var rootNode = createElement(tree);
el.appendChild(rootNode);


// function displayPrices(positionPrice) {
//   return h('span', "Position price: " + String(positionPrice))
// };
//
// function render(price, positionPrice)  {
//     return h('div', [
//       h('span', "Latest Open Price: " + String(price)),
//       displayPrices(positionPrice)
//     ]);
// };
//
// //floor and ceiling funcs
// function floor(positionPrice) {
//   return positionPrice - 0.005;
// };
// function ceiling(positionPrice) {
//   return positionPrice + 0.005;
// }




// dataFunc(function(data) {
//   //now data has loaded, setup time
//   var startDate = dateParse("20150901 000000");
//   var endDate = dateParse("20150901 000000");
//   var dateRange = dateFilter(startDate, endDate);
//   var dataDateParsed = data.map(function(d){
//     d[0] = dateParse(d[0]);
//     return d;
//   });
//
//   var period = dateRange(dataDateParsed);
//   var latestOpenPrice = period[period.length - 1][1];
//   var positionPrice = latestOpenPrice;
//   var tree = render(latestOpenPrice, positionPrice);
//   var rootNode = createElement(tree);
//   document.body.appendChild(rootNode);
//
//   setInterval(function () {
//     endDate = d3.time.minute.offset(endDate, 1);
//     dateRange = dateFilter(startDate, endDate);
//
//     period = dateRange(dataDateParsed);
//     latestOpenPrice = period[period.length - 1][1];
//     var newTree = render(latestOpenPrice, positionPrice);
//     var patches = diff(tree, newTree);
//     rootNode = patch(rootNode, patches);
//     tree = newTree;
//
//     state.data = dateRange(dataDateParsed);
//     state.domain = {
//       x: d3.extent(dateRange(dataDateParsed).map(function (d) {
//         return d[0];
//       })),
//       y: d3.extent(dateRange(dataDateParsed).map(function (d) {
//         return d[1];
//       }))
//     };
//
//     //console.log(d3.time.minute.offset(endDate, 1))
//
//     lineGraph.update(el, state);
//   }, 1000);
// });
