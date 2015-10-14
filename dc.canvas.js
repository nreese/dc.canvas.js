dc.canvasScatterPlot = function(parent, chartGroup) {
  var _chart = dc.colorMixin(dc.marginMixin(dc.baseMixin({})));
  _chart._mandatoryAttributes(['dimension', 'x', 'xAccessor', 'yAccessor']);

  var _canvas;
  var _context;
  var _x;
  var _xAccessor;
  var _xTickFormator;
  var _y;
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
    var xDomain = d3.extent(selected, function(d) {
      return _xAccessor(d);
    });
    var yDomain = d3.extent(selected, function(d) {
      return _yAccessor(d);
    });

    _chart.resetCanvas();
    renderXAxis(xDomain);
    renderYAxis(yDomain);

    selected.forEach(function(d, i) {
      _context.beginPath();
      _context.rect(
        _chart.margins().left + _x(_xAccessor(d)),
        _chart.height() - _chart.margins().bottom - _y(_yAccessor(d)),
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

  _chart.x = function(_) {
    if(!arguments.length) {
      return _x;
    }
    _x = _;
    return _chart;
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
  function renderXAxis(domain) {
    _x.domain(domain);
    _x.range([_chart.margins().left, _chart.effectiveWidth()]);

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

    var formator = _xTickFormator ? _xTickFormator : _x.tickFormat(num_ticks);
    _x.ticks(num_ticks).forEach(function(tick) {
      var x = _chart.margins().left + _x(tick);
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
  }

  _chart.y = function(_) {
    if(!arguments.length) {
      return _y;
    }
    _y = _;
    return _chart;
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
  function renderYAxis(domain) {
    if (_y === undefined) {
      _y = d3.scale.linear();
    }
    _y.domain(domain);
    _y.range([_chart.margins().top, _chart.effectiveHeight()]);

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

    var formator = _yTickFormator ? _yTickFormator : _y.tickFormat(num_ticks);
    _y.ticks(num_ticks).forEach(function(tick) {
      var x = _chart.margins().left - tick_length;
      var y = _chart.height() - _chart.margins().bottom - _y(tick);
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
  }

  return _chart.anchor(parent, chartGroup);
}