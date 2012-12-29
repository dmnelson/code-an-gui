define(function() {
    return function(tile, project) {
        project = project.toUpperCase();
        an.data("co.torri.dod.analysis.CheckinsPerStoryAnalyzer", function(data) {

            tile.title("Quantity of code changes per story");

            data = data.filter(function(e) {return e.project == project; })
            data = data.sort(function(a,b){ return (b.added + b.removed) - (a.added + a.removed) });
            data = data.slice(0,25);

            var keys = d3.keys(data[0]).filter(function(k){ return ["added", "removed"].indexOf(k) > -1 })
            

            var margin = {top: 10, right: 10, bottom: 25, left: 40},
                width = tile.width() - margin.left - margin.right,
                height = tile.height() - margin.top - margin.bottom;


            var x = d3.scale.ordinal()
                .rangeRoundBands([0, width], .1);

            var x1 = d3.scale.ordinal();
            
            var y = d3.scale.linear()
                .range([height, 0]);

            var color = d3.scale.ordinal()
            .range(["green", "crimson"]);

            data.forEach(function(d) {
              d.changes = keys.map(function(name) { return {name: name, value: +d[name]}; });
            });


            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom")
                .tickFormat(function(value){return "#" + value});

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left")
                .ticks(20);

            var svg = d3.select(tile.id).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
              .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            x.domain(data.map(function(d) { return d.story; }));
            x1.domain(keys).rangeRoundBands([0, x.rangeBand()]);
            y.domain([0,  d3.max(data, function(d) { return d3.max(d.changes, function(d) { return d.value; }); })]);

            var story = svg.selectAll(".story")
              .data(data)
              .enter().append("g")
              .attr("class", "g")
              .attr("transform", function(d) { return "translate(" + x(d.story) + ",0)"; });

            story.selectAll("rect")
              .data(function(d) { return d.changes; })
            .enter()
              .append("rect")
              .attr("x", function(d) { return x1(d.name); })
              .attr("width", x1.rangeBand())
              .attr("y", function(d) { return y(d.value); })
              .attr("height", function(d) { return height - y(d.value); })
              .attr("fill", function(d) { return color(d.name); });

            story.selectAll("text")
              .data(function(d) { return d.changes; })
            .enter()
              .append("text")
              .text(function(d) {
                var format = d3.format(".2s");
                return format(d.value);
              })
              .attr("text-anchor", "middle")
              .attr("x", function(d, i) {
                return  x1(d.name) + x1.rangeBand() / 2;
              })
              .attr("y", function(d) {
                return y(d.value) - 1;
              })
              .attr("font-family", "sans-serif")
              .attr("font-size", "9px")
              .attr("fill", "black");

            svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
              .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text("Line changes");

            svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis)
              .append("text")
              .attr("y", 16)
              .style("text-anchor", "end")
              .text("Stories");


               var legend = svg.selectAll(".legend")
      .data(["Lines removed", "Lines added"].slice().reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });

        });
    };
});
