// DIMENSIONS
const chartW = $('.main-animation').width();
console.log(chartW);


var margin = {top: 20, right: 0, bottom: 30, left: 24},
    width = chartW - margin.left - margin.right,
    height = chartW/1.8 - margin.top - margin.bottom;


var tooltip = d3.select(".bar_charts").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// SCALES

var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);

// Normal Y scale
var y1 = d3.scale.linear().range([height, 0]);

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
                .attr("x", 150)
                .attr("y", 50);

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

  draw(1994);


});


var projection = d3.geo.mercator()
    .center([0, 23 ])
    .translate([width /2, height/1.9])
    .scale(135);

var path = d3.geo.path()
    .projection(projection);

var g = svg.append("g");

// load and display the World
d3.json("data/world-110m2.json", function(error, topology) {




g.selectAll("path")
      .data(topojson.object(topology, topology.objects.countries)
          .geometries)
      .enter()
      .append("path")
      .attr("opacity",0)
      .attr("class", "map")
      .attr("d", path);
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
      .attr("x", d => x(d.city))
      .attr("y", (d, i) => y1(Math.max(0, d.level_norm)))
      .attr("height", d => Math.abs(y1(d.level_norm) - y1(0)))
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
       
  
// setTimeout(function(){ 
//   bars.transition('width')
//     .duration(500)
//     .attr("width", 10)
//     .attr("height", 10);
//   bars.transition('corners')
//     .duration(700)
//     .attr("rx", 50)
//     .attr("ry", 50)
//     .attr("x", function(d) {
//                return (projection([d.longitude, d.latitude])[0]) - Math.sqrt(50);
//        })
//      .attr("y", function(d) {
//              return projection([d.longitude, d.latitude])[1] - Math.sqrt(50);
//      })
//     .attr("r", 50)
//     .attr("opacity", 0.6);
//     d3.selectAll("path")
//     .transition()
//     .duration(500)
//     .attr("opacity", 1)
// }, 13000);


}

function animateMap() {
      d3.selectAll(".bar").transition('width')
      .duration(500)
      .attr("width", 10)
      .attr("height", 10);
   d3.selectAll(".bar").transition('corners')
      .duration(700)
      .attr("rx", 50)
      .attr("ry", 50)
      .attr("x", function(d) {
                 return (projection([d.longitude, d.latitude])[0]) - Math.sqrt(50);
         })
       .attr("y", function(d) {
               return projection([d.longitude, d.latitude])[1] - Math.sqrt(50);
       })
      .attr("r", 50)
      .attr("opacity", 0.6);
      d3.selectAll("path")
      .transition()
      .duration(500)
      .attr("opacity", 1)
};

var list = d3.range([1993],[2015]);
var countStatus = true;

for (var i = 0; i < list.length; i++) {
    setTimeout(function(y) {
       if (countStatus == true) {
         draw(list[y]);
      }
    }, i * 500, i); // we're passing i
}