var d3 = require('d3');

var dsv = d3.dsv(";", "text/plain");
// dsv("data/DAT_ASCII_EURNZD_M1_201509.csv", function(error, rows) {
//   console.log(rows[0]);
// });

function getData(callback) {
  d3.text("data/DAT_ASCII_EURNZD_M1_201509.csv", function(text) {
    if (typeof callback=="function") callback(dsv.parseRows(text));
    // .reduce(function(prev, curr) {
    //
    //   return prev
    // }, {
    //   datetime: null,
    //   open: null,
    //   high: null,
    //   low: null,
    //   close: null,
    //   volume: null
    // });
  });
}

// dsv("data/DAT_ASCII_EURNZD_M1_201509.csv")
//   .row(function(d) { console.log(d); return {date: d.key, value: +d.value}; })
//   .get(function(error, rows) { console.log(rows[0]); });

module.exports = getData;
