import React, { useEffect } from 'react'

declare global {
  interface Window {
    d3:any;
  }
}


const Triangle: React.FC = () => {

  useEffect(()=> {
    const d3 = window?.d3;
    var width = 960,
      height = 500,
      margin = 60,
      triangleSize = 400,
      squareCount = 60,
      squareSize = 45,
      speed = .03;

    var square = d3.selectAll("g")
      .selectAll("g")
      .data(function(d: any, i: any) { return i ? [0, 1, 2] : [2, 0, 1]; })
      .enter().append("g")
      .attr("transform", function(i: any) { return "rotate(" + (i * 120 + 60) + ")translate(0," + -triangleSize / Math.sqrt(12) + ")"; })
      .selectAll("rect")
      .data(d3.range(squareCount))
      .enter().append("rect")
      .datum(function(i: any) { return i / squareCount; })
      .attr({width: squareSize, height: squareSize, x: -squareSize / 2, y: -squareSize / 2});

    d3.timer(function(elapsed: any) {
      square
        .attr("transform", function(t: any) { return "translate(" + (t - .5) * triangleSize + ",0)rotate(" + (t * 120 + elapsed * speed) + ")"; });
    });


    function resize() {
      /* Update graph using new width and height (code below) */

      /* Find the new window dimensions */
      console.log(d3)
      console.log(d3.select("svg-content"))
      console.log(d3.select("svg-content").style)
      var width = parseInt(d3.select(".svg-content").style("width")) - margin*2;
      var height = parseInt(d3.select(".svg-content").style("height")) - margin*2;

    }

    d3.select(window).on('resize', resize);

    resize();

  });

  return (
    <div
      className="svg-container col-12 col-lg-6 mt-6 mt-lg-0 mb-3 mb-lg-0 pl-lg-7 pb-lg-3 pos-abs-lg-vertical-center pos-right hero__image">
      <svg width="480" height="305" viewBox="0 0 960 500" preserveAspectRatio="xMidYMid" className="svg-content">
        <defs>
          <clipPath id="clip-upper">
            <rect id="rect-clip-upper" width="960" height="305" x="-480" y="-305"/>
          </clipPath>
          <clipPath id="clip-lower">
            <rect id="rect-clip-lower" width="960" height="195" x="-480" y="0"/>
          </clipPath>
        </defs>
        <g clipPath="url(#clip-upper)" transform="translate(480,305)"/>
        <g clipPath="url(#clip-lower)" transform="translate(480,305)"/>
      </svg>
    </div>
  )
}


export default Triangle