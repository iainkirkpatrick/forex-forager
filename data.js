var d3 = require('d3');

d3.csv("data/DAT_ASCII_EURNZD_M1_2014.csv", function(error, rows) {
  console.log(rows[0]);
});
