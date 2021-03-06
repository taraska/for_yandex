var margin = {top: 20, right: 20, bottom: 30, left: 30},
    height = 3000 - margin.top - margin.bottom,
    width = 600 - margin.left - margin.right;

var formatPercent = d3.format(".0%");

var y = d3.scale.ordinal()
    .rangeRoundBands([0, height], .1, 1);

var x = d3.scale.linear()
    .range([width, 0]);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(formatPercent);

var svg = d3.select("body").append("svg")
    .attr("height", height + margin.top + margin.bottom)
    .attr("width", width + margin.left + margin.right)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var data = [
  {
    "letter": "A",
    "frequency": 0.08167
  },
  {
    "letter": "B",
    "frequency": 0.01492
  },
  {
    "letter": "C",
    "frequency": 0.0278
  },
  {
    "letter": "D",
    "frequency": 0.04253
  },
  {
    "letter": "E",
    "frequency": 0.12702
  },
  {
    "letter": "F",
    "frequency": 0.02288
  },
  {
    "letter": "G",
    "frequency": 0.02022
  },
  {
    "letter": "H",
    "frequency": 0.06094
  },
  {
    "letter": "I",
    "frequency": 0.06973
  },
  {
    "letter": "J",
    "frequency": 0.00153
  },
  {
    "letter": "K",
    "frequency": 0.00747
  },
  {
    "letter": "L",
    "frequency": 0.04025
  },
  {
    "letter": "M",
    "frequency": 0.02517
  },
  {
    "letter": "N",
    "frequency": 0.06749
  },
  {
    "letter": "O",
    "frequency": 0.07507
  },
  {
    "letter": "P",
    "frequency": 0.01929
  },
  {
    "letter": "Q",
    "frequency": 0.00098
  },
  {
    "letter": "R",
    "frequency": 0.05987
  },
  {
    "letter": "S",
    "frequency": 0.06333
  },
  {
    "letter": "T",
    "frequency": 0.09056
  },
  {
    "letter": "U",
    "frequency": 0.02758
  },
  {
    "letter": "V",
    "frequency": 0.01037
  },
  {
    "letter": "W",
    "frequency": 0.02465
  },
  {
    "letter": "X",
    "frequency": 0.0015
  },
  {
    "letter": "Y",
    "frequency": 0.01971
  },
  {
    "letter": "Z",
    "frequency": 0.00074
  }
]

    data.forEach(function (d) {
        d.frequency = +d.frequency;
    });

    y.domain(data.map(function (d) {
        return d.letter;
    }));
    x.domain([0, d3.max(data, function (d) {
        return d.frequency;
    })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Frequency");

    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("y", function (d) {
            return y(d.letter);
        })
        .attr("height", y.rangeBand())
        .attr("x", function () {
            return 0;
        })
        .attr("width", function (d) {
            return width - x(d.frequency);
        })

    var scrollHeight = Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight,
        document.body.offsetHeight, document.documentElement.offsetHeight,
        document.body.clientHeight, document.documentElement.clientHeight
    );

    window.onscroll = function(e){
        svg.selectAll('.bar')
            .style('fill', function(){
                var scrollY = window.scrollY;
                return scrollY > (scrollHeight / 10)
                    ? "rgb(180," + (scrollHeight - scrollY) * 0.05 + "," + (scrollHeight - scrollY) * 0.05 + ")"
                    : "rgb(" + scrollY / 2 + ",180," + scrollY / 2 + ")"
            });
    };

    d3.select("input").on("change", change);

    function change() {

        var y0 = y.domain(data.sort(this.checked
            ? function (a, b) {
                return b.frequency - a.frequency;
            }
            : function (a, b) {
                return d3.ascending(a.letter, b.letter);
            })
            .map(function (d) {
                return d.letter;
            }))
            .copy();

        svg.selectAll(".bar")
            .sort(function (a, b) {
                return y0(a.letter) - y0(b.letter);
            });

        var transition = svg.transition().duration(750),
            delay = function (d, i) {
                return i * 50;
            };

        transition.selectAll(".bar")
            .delay(delay)
            .attr("y", function (d) {
                return y0(d.letter);
            });

        transition.select(".y.axis")
            .call(yAxis)
            .selectAll("g")
            .delay(delay);
    }

