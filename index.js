var vdom = require('virtual-dom');
var h = require('virtual-dom/h');
var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');
var createElement = require('virtual-dom/create-element');

var atom = require('state-atom');
var barracks = require('barracks');
var vraf = require('virtual-raf');

// var dataFunc = require('./data');
var lineGraph = require('./lineGraph');
var d3 = require('d3');
var R = require('ramda');

var loadData = require('./data');

var dateParse = d3.time.format("%Y%m%d %H%M%S").parse;
var dateFilter = R.curry(function(startDate, endDate, data) {
  return data.filter(function(d){
    return d[0] >= startDate && d[0] <= endDate;
  });
});

/* INPUT */
//here be a list of events
var dispatcher = barracks();

//listen for errors
dispatcher.on('error', function(err) {
  console.log(err);
});

dispatcher.on('dataLoaded', function(data) {
  //update store with new data from new minute
  //call functions (pretty much like reducers, except individual reducers for this action)
  var dataDateParsed = data.map(function(d){
    d[0] = dateParse(d[0]);
    return d;
  });
  store.startDate.set(dataDateParsed[0][0]);
  store.endDate.set(dataDateParsed[0][0]);

  var dateRange = dateFilter(store.startDate(), store.endDate());
  var period = dateRange(dataDateParsed);
  var latestOpenPrice = period[period.length - 1][1];
  store.currentPrice.set(latestOpenPrice);
  store.position.set(latestOpenPrice);
  store.balance.set(50000);

  //dispatcher('nekMinit', dataDateParsed);

  setInterval(function () {
    dispatcher('nekMinit', dataDateParsed);
  }, 1000);
});

dispatcher.on('nekMinit', function(data) {
  store.endDate.set(d3.time.minute.offset(store.endDate(), 1));
  var dateRange = dateFilter(store.startDate(), store.endDate());
  var period = dateRange(data);
  var latestOpenPrice = period[period.length - 1][1];
  store.currentPrice.set(latestOpenPrice);

  store.graph.data.set(period);
  store.graph.domain.set(atom.struct({
    x: d3.extent(period.map(function (d) {
      //console.log(d[0])
      return +d[0];
    })),
    y: d3.extent(period.map(function (d) {
      return +d[1];
    }))
  }));

  console.log(d3.extent(period.map(function (d) {
    //console.log(d[0])
    return d[0];
  })))

  lineGraph.update(el, store.graph);

  //console.log(store.graph.data());
});


/* STATE */
//here be state: a single state atom and logic to update it when events occur
var store = atom({
  startDate: atom.value(),
  endDate: atom.value(),
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

store(function(state) {
  //what do when state change?
  tree.update(state);
});

/* RENDER */
//here be rendering logic: a single function that takes the state and returns our UI
function render(state)  {
    return h('div', [
      h('p', "Balance: " + String(state.balance)),
      h('p', "Open Price: " + String(state.currentPrice)),
      h('p', "Date: " + String(state.endDate))
    ]);
};

//need to understand virtual-raf better
var tree = vraf(store(), render, vdom)
// var tree = render(store());
// var rootNode = createElement(tree);
var el = document.body;
var graphDiv = document.createElement("div");
var graphEl = el.appendChild(graphDiv);

lineGraph.create(graphEl, {
    width: '100%',
    height: '500'
  }, store.graph
);

el.appendChild(tree());


//something like document.ready should / could fire this initial loading?
loadData(function(data) {
  //data is loaded, dispatch action
  dispatcher('dataLoaded', data);
});


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
