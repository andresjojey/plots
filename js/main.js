!(function () {
  "use strict";

  var canvasData = {
    width: 400,
    height: 400,
    axisWidth: 40,
    padding: 10
  };

  var marksData = {
    minVal: 0,
    maxVal: 100,
    minValColor: "red",
    maxValColor: "green"
  };

  var marksArray = [
    {
      subject: 'Math'
    },
    {
      subject: 'Physics'
    },
    {
      subject: 'Programming'
    },
    {
      subject: 'Biology'
    },
    {
      subject: 'English'
    },
    {
      subject: 'Ukrainian'
    }
  ];

  var plotWidth = canvasData.width - canvasData.axisWidth - canvasData.padding;
  var plotHeight = canvasData.height - canvasData.axisWidth - canvasData.padding;
  var barSpace = plotWidth / marksArray.length;

  for (var i = 0, len = marksArray.length; i < len; i++) {
    if (!marksArray[i].mark) marksArray[i].mark = Math.round(Math.random() * 90 + 10);
  }

  var colorScale = d3.scale.linear()
    .domain([marksData.minVal, marksData.maxVal])
    .range([marksData.minValColor, marksData.maxValColor]);

  var heightScale = d3.scale.linear()
    .domain([marksData.minVal, marksData.maxVal])
    .range([0, plotHeight]);

  var axisScale = d3.scale.linear()
    .domain([marksData.minVal, marksData.maxVal])
    .range([plotHeight, 0]);

  var bar = {
    space: barSpace,
    width: barSpace * 0.98
  };

  var canvas = d3.select("body")
    .append("svg")
    .attr({
      width: canvasData.width,
      height: canvasData.height
    });

  var plot = canvas
    .append("g")
    .attr({
      transform: "translate(" + canvasData.axisWidth + ", " + canvasData.padding + ")"
    });

  var axis = d3.svg.axis()
    .scale(axisScale)
    .orient("left");

  plot
    .append("g")
    .call(axis);

  var bars = plot.selectAll("rect")
    .data(marksArray, function(o){return o.mark})
    .enter()
    .append("rect")
    .attr({
      width: bar.width,
      height: heightScale(marksData.minVal),
      x: function (d, i) {
        return bar.space * i + (bar.space - bar.width)
      },
      y: plotHeight,
      fill: colorScale(marksData.minVal)
    });

  bars
    .transition()
    .delay(function(d, i) { return i * 100 })
    .duration(1000)
    .attr({
      height: function (d, i) {
        return heightScale(d.mark);
      },
      y: function (d, i) {
        return plotHeight - heightScale(d.mark)
      },
      fill: function (d, i) {
        return colorScale(d.mark)
      }
    });


  var text = plot.selectAll("text.subject")
    .data(marksArray, function(o){return o.subject})
    .enter()
    .append("text")
    .text(function(d) {
      return d.subject;
    })
    .attr({
      "text-anchor": "middle",
      "x": function(d, i) {
        return barSpace * i + barSpace / 2;
      },
      "y": (plotHeight + canvasData.padding + 10),
      "font-family": "sans-serif",
      "font-size": "11px",
      "fill": "black",
      "class": "subject"
    });

  var marks = plot.selectAll("text.mark")
    .data(marksArray, function(o){return o.mark})
    .enter()
    .append("text")
    .text(function(d) {
      return d.mark;
    })
    .attr({
      "text-anchor": "middle",
      "x": function(d, i) {
        return barSpace * i + barSpace / 2;
      },
      "y": function(d){
        return plotHeight - heightScale(d.mark) + canvasData.padding
      },
      "font-family": "sans-serif",
      "font-size": "11px",
      "fill": "white",
      "class": "mark"
    });

}());

(function(){
  "use strict";


  var canvasData = {
    width: 400,
    height: 400,
    padding: 10
  };
  var radius = Math.min(canvasData.width, canvasData.height) / 2;

  var testData = [
    {
      level: 1,
      qQnty: 10,
      qCost: 1,
      qRight: 9
    },
    {
      level: 2,
      qQnty: 8,
      qCost: 2,
      qRight: 3
    },
    {
      level: 3,
      qQnty: 6,
      qCost: 3,
      qRight: 1
    },
    {
      level: 4,
      qQnty: 4,
      qCost: 4,
      qRight: 1
    },
    {
      level: 5,
      qQnty: 2,
      qCost: 5,
      qRight: 1
    }
  ];


  var canvas = d3.select("body")
    .append("svg")
    .attr({
      width: canvasData.width,
      height: canvasData.height
    })
    .append("g")
    .attr("transform", "translate(" + canvasData.width / 2 + "," + canvasData.height / 2 + ")");

  var p = Math.PI * 2;

  var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.qCost * d.qQnty; });

  var arc = d3.svg.arc()
    .innerRadius(0)
    .outerRadius(function (d) {
      return radius * d.data.qRight / d.data.qQnty;
    });

  var outlineArc = d3.svg.arc()
    .innerRadius(0)
    .outerRadius(radius);

  var colorScale = d3.scale.linear()
    .domain([d3.min(testData, function(d){ return d.level }), d3.max(testData, function(d){ return d.level })])
    .range(["lightgreen", "green"]);
  var colorScale2 = d3.scale.linear()
    .domain([d3.min(testData, function(d){ return d.level }), d3.max(testData, function(d){ return d.level })])
    .range(["yellow", "orange"]);



  var outerPath = canvas.selectAll(".outlineArc")
    .data(pie(testData))
    .enter().append("path")
    .attr("fill", function(d) { return colorScale2(d.data.level); })
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .attr("class", "outlineArc")
    .attr("d", outlineArc);

  var path = canvas.selectAll(".solidArc")
    .data(pie(testData))
    .enter().append("path")
    .attr("fill", function(d) { return colorScale(d.data.level); })
    .attr("class", "solidArc")
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .attr("d", arc);


  //var tip = d3.tip()
  //  .attr('class', 'd3-tip')
  //  .offset([0, 0])
  //  .html(function(d) {
  //    return d.data.label + ": <span>" + d.data.score + "</span>";
  //  });
  //svg.call(tip);

  //.on('mouseover', tip.show)
  //.on('mouseout', tip.hide);
  //var score =
  //  data.reduce(function(a, b) {
  //    //console.log('a:' + a + ', b.score: ' + b.score + ', b.weight: ' + b.weight);
  //    return a + (b.score * b.weight);
  //  }, 0) /
  //  data.reduce(function(a, b) {
  //    return a + b.weight;
  //  }, 0);

  //canvas.append("svg:text")
  //  .attr("class", "aster-score")
  //  .attr("dy", ".35em")
  //  .attr("text-anchor", "middle") // text-align: right
  //  .text(Math.round(score));


}());