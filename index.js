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
var ceilingFloorCount = require('./ceilingFloorCount');

var dateParse = d3.time.format("%Y%m%d %H%M%S").parse;
var dateFilter = R.curry(function(startDate, endDate, data) {
  return data.filter(function(d){
    return d.date >= startDate && d.date <= endDate;
  });
});

function inverseRate(rate) {
  return 1 / rate;
}

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

  //hacky as, adding properties to arrays :)
  // var dataDateParsed = data.map(function(d){
  //   d.date = dateParse(d[0]);
  //   return d;
  // });
  var NZDEUR = data.map(function(d) {
    d.open = inverseRate(+d[1]);
    d.high = inverseRate(+d[2]);
    d.low = inverseRate(+d[3]);
    d.close = inverseRate(+d[4]);
    return {
      date: dateParse(d[0]),
      open: inverseRate(+d[1]),
      high: inverseRate(+d[2]),
      low: inverseRate(+d[3]),
      close: inverseRate(+d[4])
    }
  })
  console.log(NZDEUR);

  var linesToRender = ['open', 'close'];
  var lines = linesToRender.map(function(type) {
    return {
      type: type,
      values: NZDEUR.map(function(d) {
        var price;
        if (type === 'open') {
          price = d.open
        } else {
          price = d.close
        }
        return {date: d.date, price: price };
      })
    };
  });

  console.log(lines);

  //graph stuff
  store.graph.data.set(lines);
  store.graph.domain.set(atom.struct({
    x: d3.extent(NZDEUR, function(d) { return d.date; }),
    y: [
      d3.min(lines, function(c) { return d3.min(c.values, function(v) { return v.price; }); }),
      d3.max(lines, function(c) { return d3.max(c.values, function(v) { return v.price; }); })
    ]
  }));

  //console.log(store.graph.domain.x())

  lineGraph.create(graphEl, {
      width: '100%',
      height: '500'
    }, store.graph
  );
  lineGraph.update(el, store.graph);

  /*
  Would be cool to have a function that could take in a series (or range) of pip values, and return back the value that generates the lowest recordStreak...
  OR eventually the function returns back the value (or combo of ceiling / floor values) that returns the highest overall profit over the time period?
  */
  var ceiling = 20;
  var floor = 20;
  var pipTest = ceilingFloorCount(ceiling, floor, NZDEUR);
  console.log(pipTest);


  // store.startDate.set(NZDEUR[0].date);
  // store.endDate.set(NZDEUR[1].date);
  //
  // var dateRange = dateFilter(store.startDate(), store.endDate());
  // var period = dateRange(NZDEUR);
  //
  // var latestOpenPrice = period[period.length - 1].open;
  // var latestClosePrice = period[period.length - 1].close;
  //
  // store.openPrice.set(latestOpenPrice);
  // store.closePrice.set(latestClosePrice);
  // store.position.set(latestOpenPrice);
  // store.ceiling.set(+store.position() + 0.005)
  // store.floor.set(+store.position() - 0.005)
  //
  // store.balance.set(50000);

  //dispatcher('nekMinit', dataDateParsed);

  // setInterval(function () {
  //   dispatcher('nekMinit', dataDateParsed);
  // }, 1000);
});

dispatcher.on('nekMinit', function(data) {
  //set the endDate to the next minute, and slice the data from start to new end
  store.endDate.set(d3.time.minute.offset(store.endDate(), 1));
  var dateRange = dateFilter(store.startDate(), store.endDate());
  var period = dateRange(data);

  //get and set new state
  var latestOpenPrice = period[period.length - 1].open;
  var latestClosePrice = period[period.length - 1].close;
  store.openPrice.set(latestOpenPrice);
  store.closePrice.set(latestClosePrice);

  //console.log(store.floor());
  if (store.floor() >= store.closePrice()) {
    //dispatch action to handle buy / sell
    console.log('openprice met the floor');
  } else if (store.ceiling() <= store.openPrice() ) {
    //dispatch action to handle buy / sell
    console.log('openprice met the ceiling');
  }

  //console.log(store.graph.data());
});


/* STATE */
//here be state: a single state atom and logic to update it when events occur
var store = atom({
  startDate: atom.value(),
  endDate: atom.value(),
  balance: atom.value(),
  openPrice: atom.value(),
  closePrice: atom.value(),
  position: atom.value(),
  direction: atom.value(),
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
      h('p', "Current Position: " + String(state.position)),
      h('p', "Ceiling: " + String(state.ceiling)),
      h('p', "Floor: " + String(state.floor)),
      h('p', "Open Price: " + String(state.openPrice)),
      h('p', "Close Price: " + String(state.closePrice)),
      h('p', "Date: " + String(state.endDate))
    ]);
};

//need to understand virtual-raf better
var tree = vraf(store(), render, vdom)
// var tree = render(store());
// var rootNode = createElement(tree);
var el = document.body;

//graph init
var graphDiv = document.createElement("div");
var graphEl = el.appendChild(graphDiv);

//el.appendChild(tree());


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
