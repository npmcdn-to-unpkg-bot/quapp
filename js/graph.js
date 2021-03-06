function createChart() {
  var svg = d3.select("svg#columnChart"),
      margin = {top: 10, right: 80, bottom: 30, left: 40},
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom,
      g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  var x = d3.scaleBand()
      .rangeRound([0, width])
      .padding(0.2)
      .align(0.1);

  var y = d3.scaleLinear()
      .rangeRound([height, 0]);

  var z = d3.scaleOrdinal()
      .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

  var stack = d3.stack()
      .offset(d3.stackOffsetExpand);     

  userInputsArea.unshift(["Layer Name","Area","Thickness","%Area","CPID"])
  userInputsVolume.unshift(["Layer Name","Volume","%Volume","CPID"])
  var data = calculateImpacts(quartzDB, calculateMasses(quartzDensities,userInputsArea,userInputsVolume))
  console.log(data)
  data.sort(function(a, b) { return b[data.columns[1]] / b.total - a[data.columns[1]] / a.total; });

  x.domain(data.map(function(d) { return d.Impact; }));
  z.domain(data.columns.slice(1));

  var serie = g.selectAll(".serie")
    .data(stack.keys(data.columns.slice(1))(data))
    .enter().append("g")
      .attr("class", "serie")
      .attr("fill", function(d) { return z(d.key); });

  serie.selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function(d) { return x(d.data.Impact); })
      .attr("y", function(d) { return y(d[1]); })
      .attr("height", function(d) { return y(d[0]) - y(d[1]); })
      .attr("width", x.bandwidth());

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(10, "%"));

  var legend = serie.append("g")
      .attr("class", "legend")
      .attr("transform", function(d) { var d = d[d.length - 1]; return "translate(" + (x(d.data.Impact) + x.bandwidth()) + "," + ((y(d[0]) + y(d[1])) / 2) + ")"; });

  legend.append("line")
      .attr("x1", -6)
      .attr("x2", 6)
      .attr("stroke", "#000");

  legend.append("text")
      .attr("x", 9)
      .attr("dy", "0.35em")
      .attr("fill", "#000")
      .style("font", "10px sans-serif")
      .text(function(d) { return d.key; });                              

  function type(d, i, columns) {
    for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
    d.total = t;
    return d;
  }

};

function createQuartzTable() {
  
  var table = $('table#quartzTable')
  var thead = table.find('thead')
  thead.append('<tr></tr>')
  var tbody = table.find('tbody')
  console.log(tbody)
  for (var header of quartzDescr[0]) {
      thead.find('tr').append('<th>'+header+'</th>')
  }
  // for every row in quartzDescr
  // create a tr
  // then iterate through the items, and add them to a different th
  for (i=1;quartzDescr.length;i++) {
    tbody.append('<tr></tr>')
    var tr = tbody.find('tr:nth-child('+i+')')

    for (var item of quartzDescr[i]) {
      tr.append('<td>'+item+'</td>')
    }
  }


}