var width = 960,
    height = 500,
    margin = 60,
    triangleSize = 400,
    squareCount = 60,
    squareSize = 45,
    speed = .03;

var square = d3.selectAll("g")
  .selectAll("g")
    .data(function(d, i) { return i ? [0, 1, 2] : [2, 0, 1]; })
  .enter().append("g")
    .attr("transform", function(i) { return "rotate(" + (i * 120 + 60) + ")translate(0," + -triangleSize / Math.sqrt(12) + ")"; })
  .selectAll("rect")
    .data(d3.range(squareCount))
  .enter().append("rect")
    .datum(function(i) { return i / squareCount; })
    .attr({width: squareSize, height: squareSize, x: -squareSize / 2, y: -squareSize / 2});

d3.timer(function(elapsed) {
  square
      .attr("transform", function(t) { return "translate(" + (t - .5) * triangleSize + ",0)rotate(" + (t * 120 + elapsed * speed) + ")"; });
});


function resize() {
  /* Update graph using new width and height (code below) */

  /* Find the new window dimensions */
  var width = parseInt(d3.select(".svg-content").style("width")) - margin*2;
  var height = parseInt(d3.select(".svg-content").style("height")) - margin*2;

}

d3.select(window).on('resize', resize); 

resize();
