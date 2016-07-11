var width =  $(".col-lg-8").width(),
    mapRatio = 0.75,
    height = width * mapRatio;

var projection = d3.geo.mercator()
    .center([0, 23 ])
    .translate([width / 2.2, height/1.9])
    .scale(113);


var svg = d3.select(".map").append("svg")
    .attr("width", width)
    .attr("height", height);


var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var path = d3.geo.path()
    .projection(projection);

var g = svg.append("g");

// load and display the World
d3.json("data/world-110m2.json", function(error, topology) {

// load and display the cities
d3.csv("data/all_cities_change_geocoded.csv", function(error, data) {
var circles =  g.selectAll("circle")
       .data(data)
       .enter()
       .append("circle")
       .attr("cx", function(d) {
               return projection([d.Longitude, d.Latitude])[0];
       })
       .attr("cy", function(d) {
               return projection([d.Longitude, d.Latitude])[1];
       })
       .attr("r", 4)
       .style("fill", function(d){
         if(d.level > 0 && d.level < 100 ) {
           return "#d18e9a"
         } else if  (d.level >= 100) {
           return "#9e0142"
         }  else if  (d.level < -100) {
           return "#66C2A5"
         } else {
           return "#B6E2D4"
              }
            })
       .style("opacity", 0.5);

       circles.on("mouseover", function(d) {
           tooltip.transition()
           .duration(250)
           .style("opacity", 1);
           tooltip.html("<strong>" + d.city + "</strong>" + "<br>" + d.level)
           .style("left", (d3.event.pageX - 25) + "px")
           .style("top", (d3.event.pageY - 28) + "px");
         })
         .on("mouseout", function(d) {
           tooltip.transition()
           .duration(250)
           .style("opacity", 0);
            })

});


g.selectAll("path")
      .data(topojson.object(topology, topology.objects.countries)
          .geometries)
    .enter()
      .append("path")
      .attr("d", path)
});



// zoom and pan
// var zoom = d3.behavior.zoom()
//     .on("zoom",function() {
//         g.attr("transform","translate("+
//             d3.event.translate.join(",")+")scale("+d3.event.scale+")");
//         g.selectAll("circle")
//             .attr("d", path.projection(projection));
//         g.selectAll("path")
//             .attr("d", path.projection(projection));
//
//   });
//
// svg.call(zoom)
