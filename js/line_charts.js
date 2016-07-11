function line_chart(container, data) {

var margin = {top: 20, right: 25, bottom: 30, left: 5},
    width = $(".chart").width() - margin.left - margin.right,
    height = 150 - margin.top - margin.bottom;

var formatDate = d3.time.format("%Y");
var bisectDate = d3.bisector(function(d) { return d.year; }).left;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .ticks(d3.time.year, 25)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .ticks(3)
    .orient("left");

var line = d3.svg.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.level_norm); });



var svg = d3.select(container).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var focus = svg.append("g")
    .style("display", "none");

d3.csv(data, type, function(error, data) {
  if (error) throw error;

  x.domain(d3.extent(data, function(d) { return d.year }));
  y.domain([0, 400]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);


  // append the circle at the intersection
  focus.append("circle")
       .attr("class", "y")
       .style("fill", "#9e0142")
       .attr("r", 5);


  // place the value at the intersection

  focus.append("text")
       .attr("class", "y1")
       .attr("dx", 8)
       .attr("dy", "-.3em");

  // place the date at the intersection

  focus.append("text")
       .attr("class", "y2")
       .attr("dx", 8)
       .attr("dy", "1em");

// append the rectangle to capture mouse
    svg.append("rect")
       .attr("width", width)
       .attr("height", height)
       .style("fill", "none")
       .style("pointer-events", "all")
       .on("mouseover", function() { focus.style("display", null); })
       .on("mouseout", function() { focus.style("display", "none"); })
       .on("mousemove", mousemove);

 function mousemove() {
 	var x0 = x.invert(d3.mouse(this)[0]),
     	i = bisectDate(data, x0, 1),
     	d0 = data[i - 1],
     	d1 = data[i],
     	d = x0 - d0.year > d1.year - x0 ? d1 : d0;

  focus.select("circle.y")
     	.attr("transform",
     	"translate(" + x(d.year) + "," +
     	y(d.level_norm) + ")");


  focus.select("text.y1")
  		.attr("transform",
  	  "translate(" + -5 + "," +
  		12 + ")")
  		.text("Difference: " +d.level_norm);


  focus.select("text.y2")
  		.attr("transform",
  	  "translate(" + -5 + "," +
  		15 + ")")
  		.text(formatDate(d.year));

}
});

function type(d) {
  d.year = formatDate.parse(d.year);
  d.level_norm = +d.level_norm;
  return d;
}

}


function line_chart_axes(container, data) {

var margin = {top: 20, right: 25, bottom: 30, left: 30},
    width = $(".chart").width() - margin.left - margin.right,
    height = 150 - margin.top - margin.bottom;

var formatDate = d3.time.format("%Y");
var bisectDate = d3.bisector(function(d) { return d.year; }).left;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .ticks(3)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .ticks(3)
    .orient("left");

var line = d3.svg.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.level_norm); });



var svg = d3.select(container).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var focus = svg.append("g")
    .style("display", "none");

d3.csv(data, type, function(error, data) {
  if (error) throw error;

  x.domain(d3.extent(data, function(d) { return d.year }));
  y.domain([0, 400]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y2axis")
      .call(yAxis)
      .append("text")
      // .attr("transform", "rotate(-90)")
      .attr("y", -15)
      .attr("x", -5)
      .attr("dy", ".55em")
      .style("text-anchor", "end")
      .text("(mm)");

  svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);


  // append the circle at the intersection
  focus.append("circle")
       .attr("class", "y")
       .style("fill", "#9e0142")
       .attr("r", 5);


  // place the value at the intersection

  focus.append("text")
       .attr("class", "y1")
       .attr("dx", 8)
       .attr("dy", "-.3em");

  // place the date at the intersection

  focus.append("text")
       .attr("class", "y2")
       .attr("dx", 8)
       .attr("dy", "1em");

// append the rectangle to capture mouse
    svg.append("rect")
       .attr("width", width)
       .attr("height", height)
       .style("fill", "none")
       .style("pointer-events", "all")
       .on("mouseover", function() { focus.style("display", null); })
       .on("mouseout", function() { focus.style("display", "none"); })
       .on("mousemove", mousemove);

 function mousemove() {
 	var x0 = x.invert(d3.mouse(this)[0]),
     	i = bisectDate(data, x0, 1),
     	d0 = data[i - 1],
     	d1 = data[i],
     	d = x0 - d0.year > d1.year - x0 ? d1 : d0;

  focus.select("circle.y")
     	.attr("transform",
     	"translate(" + x(d.year) + "," +
     	y(d.level_norm) + ")");


  focus.select("text.y1")
  		.attr("transform",
  	  "translate(" + -5 + "," +
  		12 + ")")
  		.text("Difference: " + d.level_norm);


  focus.select("text.y2")
  		.attr("transform",
  	  "translate(" + -5 + "," +
  		15 + ")")
  		.text(formatDate(d.year));

}
});

function type(d) {
  d.year = formatDate.parse(d.year);
  d.level_norm = +d.level_norm;
  return d;
}

}


line_chart_axes(".galveston", "data/Galveston.csv");
line_chart(".rockport", "data/Rockport.csv");
line_chart(".stPetersburg", "data/St._Petersburg.csv");
line_chart(".charleston", "data/Charleston.csv");
line_chart(".fortPulaski", "data/Fort_Pulaski.csv");
line_chart(".cordova", "data/Cordova.csv");
line_chart(".newYork", "data/New_york.csv");
line_chart_axes(".sanDiego", "data/San_diego.csv");
line_chart(".keyWest", "data/key_west.csv");
line_chart(".sanFrancisco", "data/San_Francisco.csv");
line_chart(".boston", "data/Boston.csv");
line_chart(".losAngeles", "data/Los_Angeles.csv");
line_chart(".portland", "data/Portland.csv");
