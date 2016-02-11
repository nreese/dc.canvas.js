dc.canvasScatterPlot = function(parent, chartGroup) {
  var _chart = dc.coordinateGridMixin({});
  _chart._mandatoryAttributes(['dimension', 'x', 'xAccessor', 'yAccessor']);

  var _canvas;
  var _context;
  var _xAccessor;
  var _xTickFormator;
  var _yAccessor;
  var _yTickFormator;

  var tick_length = 8;
  var font_size = 10;
  var label_padding = 3;
  var num_ticks = 6;

  _chart._doRender = function() {
    return _chart._doRedraw();
  }

  _chart._doRedraw = function () {
    var selected = _chart.dimension().top(Infinity);    
    _chart.resetCanvas();
    prepareXAxis(selected);
    renderXAxis();
    prepareYAxis(selected);
    renderYAxis();

    selected.forEach(function(d, i) {
      _context.beginPath();
      _context.rect(
        _chart.margins().left + _chart.x()(_xAccessor(d)),
        _chart.height() - _chart.margins().bottom - _chart.y()(_yAccessor(d)),
        4, 4);
      _context.fillStyle = _chart.getColor(d, i);
      _context.fill();
      _context.closePath();
    });

    return _chart;
  }

  _chart.resetCanvas = function() {
    _chart.select('canvas').remove();
    return generateCanvas();
  }
  function generateCanvas() {
    _canvas = _chart.root().append('canvas')
      .attr('width', _chart.width())
      .attr('height', _chart.height());
    _context = _canvas.node().getContext('2d');
    return _canvas;
  }

  _chart.xAccessor = function(_) {
    if(!arguments.length) {
      return _xAccessor;
    }
    _xAccessor = _;
    return _chart;
  }
  _chart.xTickFormator = function(_) {
    if(!arguments.length) {
      return _xTickFormator;
    }
    _xTickFormator = _;
    return _chart;
  }
  function prepareXAxis (selected) {
    var domain = _chart.x().domain();
    if (_chart.elasticX() || domain.length === 0) {
      domain = d3.extent(selected, function(d) {
        return _xAccessor(d);
      });
    }

    if ("ordinal" === getScaleType(_chart.x())) {
      _chart.x().rangeRoundBands([_chart.margins().left, _chart.effectiveWidth()]);
      //ticks function is used to iterate through axis ticks
      //define ticks function to returns domain array
      _chart.x().ticks = function() { return _chart.x().domain(); }
      _xTickFormator = function(value) { return value; }
    } else {
      _chart.x().domain(domain);
      _chart.x().range([_chart.margins().left, _chart.effectiveWidth()]);
    }
  }
  function renderXAxis() {
    //draw x-axis baseline
    _context.beginPath();
    _context.rect(
      _chart.margins().left,
      _chart.height() - _chart.margins().bottom,
      _chart.effectiveWidth(), 
      1);
    _context.fillStyle = 'black';
    _context.fill();
    _context.closePath();

    var formator = _xTickFormator ? _xTickFormator : _chart.x().tickFormat(num_ticks);
    _chart.x().ticks(num_ticks).forEach(function(tick) {
      var x = _chart.margins().left + _chart.x()(tick);
      var y = _chart.height() - _chart.margins().bottom;
      _context.beginPath();
      _context.rect(x, y, 1, tick_length);
      _context.fillStyle = 'black';
      _context.fill();
      _context.closePath();

      var label = formator(tick);
      var dx = (label.length / 2) * -5; //shift text left to center
      var dy = font_size + tick_length + label_padding; //shift text below tick lines
      _context.font = font_size + 'pt';
      _context.fillText(label, x + dx, y + dy);
    });

    if (_chart.xAxisLabel()) {
      var x = _chart.margins().left + _chart.xAxisLength() / 2;
      var y = _chart.height() - 12; //_xAxisLabelPadding but can not use since not exposed
      _context.fillText(_chart.xAxisLabel(), x, y);
    }
  }

  _chart.yAccessor = function(_) {
    if(!arguments.length) {
      return _yAccessor;
    }
    _yAccessor = _;
    return _chart;
  }
  _chart.yTickFormator = function(_) {
    if(!arguments.length) {
      return _yTickFormator;
    }
    _yTickFormator = _;
    return _chart;
  }
  function prepareYAxis(selected) {
    if (_chart.y() === undefined) {
      _chart.y(d3.scale.linear().domain([]));
    }

    var domain = _chart.y().domain();
    if (_chart.elasticY() || domain.length === 0) {
      domain = d3.extent(selected, function(d) {
        return _yAccessor(d);
      });
    }

    if ("ordinal" === getScaleType(_chart.y())) {
      _chart.y().rangeRoundBands([_chart.margins().top, _chart.effectiveHeight()]);
      //ticks function is used to iterate through axis ticks
      //define ticks function that returns domain array
      _chart.y().ticks = function() { return _chart.y().domain(); }
      _yTickFormator = function(value) { return value; }
    } else {
      _chart.y().domain(domain);
      _chart.y().range([_chart.margins().top, _chart.effectiveHeight()]);
    }
  }
  function renderYAxis() {
    //draw y-axis baseline
    _context.beginPath();
    _context.rect(
      _chart.margins().left,
      _chart.margins().top,
      1,
      _chart.effectiveHeight());
    _context.fillStyle = 'black';
    _context.fill();
    _context.closePath();

    var formator = _yTickFormator ? _yTickFormator : _chart.y().tickFormat(num_ticks);
    _chart.y().ticks(num_ticks).forEach(function(tick) {
      var x = _chart.margins().left - tick_length;
      var y = _chart.height() - _chart.margins().bottom - _chart.y()(tick);
      _context.beginPath();
      _context.rect(x, y, tick_length, 1);
      _context.fillStyle = 'black';
      _context.fill();
      _context.closePath();

      var label = formator(tick);
      var dx = (label.length * -5) - label_padding; //shift text left to of ticks
      var dy = font_size/3; //center text
      _context.font = font_size + 'pt';
      _context.fillText(label, x + dx, y + dy);
    });

    if (_chart.yAxisLabel()) {
      var labelXPosition = 12; //_yAxisLabelPadding but can not use since not exposed 
      var labelYPosition = (_chart.margins().top + _chart.yAxisHeight() / 2);
      //http://stackoverflow.com/questions/3167928/drawing-rotated-text-on-a-html5-canvas 
      _context.save();
      _context.translate(labelXPosition, labelYPosition);
      _context.rotate(-Math.PI/2);
      _context.textAlign = "center";
      _context.fillText(_chart.yAxisLabel(), labelXPosition, 0);
      _context.restore();
    }
  }

  function getScaleType(scale) {
    var type = "quantitative";
    if (scale.hasOwnProperty("rangePoints")) {
      type = "ordinal";
    }
    return type;
  }

  return _chart.anchor(parent, chartGroup);
}