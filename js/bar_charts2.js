// DIMENSIONS

var margin = {top: 20, right: 20, bottom: 30, left: 30},
    width = 1200 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

// SCALES

var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);

// Normal Y scale
var y1 = d3.scale.linear()
    .range([height, 0]);

// AXES
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y1)
    .orient("left")
    .ticks(10);

// APPEND SVG

var svg = d3.select(".bar_charts").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// APPEND years for our axes

svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")");

svg.append("g")
      .attr("class", "y axis");


var  text1 = d3.select('svg').append("text")
                .attr("class", "count")
                .attr("x", 50)
                .attr("y", 30);

var chartData;

// Get the data
d3.csv("data/all_20.csv", function(error, data) {

  // Process the data
  data.forEach(function(d){
    d.level_norm = +d.level_norm;
  });

  // d3.nest lets us nest our data by a grouping key, in this cade the d.year property
  chartData = d3.nest()
                .key(function(d){ return d.year; })
                .map(data)

  draw(1965);


});





// Put all our dynamic properties in a draw function
function draw(year){

  // Use the year to get the data we want
  var data = chartData[year];

  // Set scale domains
  // Map gives us an array of our cities, which is our ordinal scale's domain
  x.domain(data.map(function(d) { return d.city; }));
  y1.domain([-400, 400]);

  // Call our axis functions
  // d3.selectAll(".x.axis")
  //     .call(xAxis);

  d3.selectAll(".y.axis")
      .call(yAxis);

  // Join
  var bars = svg.selectAll(".bar")
      .data(data);

  // Enter
  bars
      .enter().append("rect")
      .attr("class", "bar");

  // Update
  bars
      // .attr("class", function(d){return d.level_norm < 0 ? "negative" : "positive";})
      .attr("width", x.rangeBand())
      .transition()
      .duration(550)
      .attr("x", function(d) { return x(d.city); })
      .attr("y", function(d, i) { return y1(Math.max(0, d.level_norm));})
      .attr("height", function(d) { return Math.abs(y1(d.level_norm) - y1(0)); })
      .attr("rx", 0)
      .attr("ry", 0)
      .attr("r",0)
      .style("fill", function(d) {
            if (d.level_norm < 0) {return "#66C2A5"}
            else  { return "#9e0142" }
        ;});

        bars.on("mouseover", function(d) {
            tooltip.transition()
            .duration(250)
            .style("opacity", 1);
            tooltip.html("<strong>" + d.city + "</strong>" + "<br>" + d.level_norm)
            .style("left", (d3.event.pageX - 25) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
          })
          .on("mouseout", function(d) {
            tooltip.transition()
            .duration(250)
            .style("opacity", 0);
             })

  // Exit
  bars.exit().remove();

  text1.text(year);
        
      var swoopy = swoopyArrow()
     .angle(Math.PI/1.5)
     .x(function(d) { return d[0]; })
     .y(function(d) { return d[1]; });


  svg.append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '-10 -10 20 20')
      .attr('markerWidth', 15)
      .attr('markerHeight', 15)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M-6.75,-6.75 L 0,0 L -6.75,6.75')

  d3.select('svg').append("path.arrow")
    .attr('marker-end', 'url(#arrow)')
    .datum([[width/1.5,height/1.1],[width/1.2 - 30,height/1.2]])
    .attr("d", swoopy)

  
setTimeout(function(){ 
  bars.transition('width')
        .duration(500)
        .attr("width", 10)
        .attr("height", 10);
      bars.transition('corners')
        // .delay(1250)
        .duration(700)
        .attr("rx", 50)
        .attr("ry", 50)
        .attr("y", function(d) {return y1(d.level_norm)})
        .attr("r", 50)
        .attr("opacity", 0.6);
}, 13000);




}

var list = d3.range([1993],[2015]);

for (var i = 0; i < list.length; i++) {
  setTimeout(function(y) {
    draw(list[y]);
    $(".count").text(list[y])
  }, i * 500, i); // we're passing i
}