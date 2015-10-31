var R = require('ramda');

function buy(amount, price) {
  //amount is the number of $1 'lots' from the original currency to trade
  //price is the price of the paired currency
  return amount * price;
}


// module.exports = R.curry(function(ceiling, floor, positionPrice, longOrShort) {
//   //
// });
