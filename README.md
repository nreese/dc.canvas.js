# dc.canvas.js
DC extension that provides support for canvas charts.

## Why Canvas
SVG performance becomes a bottleneck when rendering scatter plots with 1000s of data points. This extension provides a scatter plot that is rendered with canvas and can be used in conjunction with existing dc charts.

## Usage
```
 var data = [
    {x: 2, y: 1, category: 'a'},
    {x: 4, y: 2, category: 'b'},
    {x: 6, y: 3, category: 'c'},
    {x: 8, y: 4, category: 'd'},
    {x: 1, y: 5, category: 'a'},
    {x: 3, y: 5, category: 'b'},
    {x: 5, y: 5, category: 'c'},
    {x: 7, y: 5, category: 'd'}
  ];
  var cf = crossfilter(data);
  var categoryDim = cf.dimension(function(d) {return d.category;});

  dc.canvasScatterPlot('#scatterPlotContainer')
    .width(300)
    .height(300)
    .dimension(categoryDim)
    .x(d3.scale.linear())
    .xAccessor(function(d) {
      return d.x;
    })
    .yAccessor(function(d) {
      return d.y;
    });

  dc.renderAll();
```

## Crossfilter dimension
dc.js scatter plots require a 2-d dimension. For example `var dim = cf.dimension(function(d) {return [d.x, d.y]; });`. The keyAccessor function `_chart.keyAccessor(function (d) { return originalKeyAccessor(d)[0]; });` is used to retrieve x-axis positions from the 2-d dimension. The valueAccessor function `_chart.valueAccessor(function (d) { return originalKeyAccessor(d)[1]; });` is used to retrieve y-axis positions from the 2-d dimension. Below is a code snipped from dc.js scatter plot showing how






