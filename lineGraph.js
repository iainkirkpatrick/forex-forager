var d3 = require('d3');

var line = {};

//refactor
line.margin = { top: 30, right: 50, bottom: 200, left: 100 };
    // width = el.offsetWidth - margin.left - margin.right,
    // height = el.offsetHeight - margin.top - margin.bottom;

line.color = d3.scale.category10();


line.create = function(el, props, state) {
  //refactor svg creation out of specific graph creation? ala RNBZ work
  var svg = d3.select(el).append('svg')
      .attr('class', 'd3')
      .attr('width', props.width)
      .attr('height', props.height);

  svg.append('g')
      .attr('class', 'd3-lines')
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

  svg.append('g')
      .attr('class', 'd3-axes')
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

  this.update(el, state, props);
};

line.update = function(el, state) {

  // Re-compute the scales, and render the data lines
  var scales = this._scales(el, state.domain());
  var axes = this._axes(scales);

  this._drawAxes(el, axes);
  this._drawLines(el, scales, state);

};

line.destroy = function(el) {
  // Any clean-up would go here
  // in this example there is nothing to do
};

line._scales = function(el, domain) {

  if (!domain) {
    domain = {
      x: ["01/09/2015", "02/09/2015"],
      y: [0, 1000]
    }
    //return null;
  }
  var width = el.offsetWidth - this.margin.left - this.margin.right;
  var height = el.offsetHeight - this.margin.top - this.margin.bottom;
  // var x = d3.scale.ordinal()
  //   .rangeRoundBands([0, width], .5)
  //   .domain(domain.x);
  var x = d3.time.scale()
    .range([0, width])
    .domain(domain.x);

  var y = d3.scale.linear()
    .range([height, 0])
    .domain(domain.y);

  // var z = d3.scale.linear()
  //   .range([5, 20])
  //   .domain([1, 10]);

  return {x: x, y: y};
};

line._axes = function(scales) {
  var xAxis = d3.svg.axis()
    .scale(scales.x)
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(scales.y)
    .orient("left");

    return {x: xAxis, y: yAxis};
};

line._drawLines = function(el, scales, state) {
  console.log(state.data())

  var height = el.offsetHeight - this.margin.top - this.margin.bottom;
  this.color.domain(state.data().map(function(d) {
    return d.type;
  }));
  var color = this.color;

  var generator = d3.svg.line()
    .x(function (d) { return scales.x(d.date); })
    .y(function (d) { return scales.y(d.price); });

  var g = d3.select(el).selectAll('.d3-lines');
  var line = g.selectAll('.d3-line')
    .data(state.data());

  // ENTER
  line.enter().append('path')
      .attr('class', 'd3-line')
      .attr("fill", "none")
      .attr("stroke", function(d) { return color(d.type); })
      .attr("stroke-width", "2px");

  // ENTER & UPDATE
  line.attr("d", function (d) {
      return d3.select(this).attr("d");
  })
  .transition()
  .attr("d", function (d) {
    console.log(d)
      return generator(d.values);
  });

  // EXIT
  line.exit()
    .remove();
};

line._drawAxes = function(el, axes) {
  var height = el.offsetHeight - this.margin.top - this.margin.bottom;

  var g = d3.select(el).selectAll('.d3-axes');
  //remove current axes (refactor later for transitions if needed)
  g.selectAll('*').remove();

  g.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(axes.x);

  g.append("g")
      .attr("class", "y axis")
      .call(axes.y);
};

module.exports = line;
