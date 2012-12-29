define(function() {
    return function(tile, project) {
        project = project.toUpperCase();
        an.data("co.torri.dod.analysis.CheckinsPerStoryAnalyzer", function(data) {

            tile.title("Quantity of check-ins per story");

            data = data.filter(function(e) {return e.project == project; }).slice(0,30);

            var margin = {top: 10, right: 10, bottom: 25, left: 40},
                width = tile.width() - margin.left - margin.right,
                height = tile.height() - margin.top - margin.bottom;


            var x = d3.scale.ordinal()
                .rangeRoundBands([0, width], .1);
          
            
            var y = d3.scale.linear()
                .range([height, 0]);

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

            var max = d3.max(data, function(d) { return d.checkins; });
            x.domain(data.map(function(d) { return d.story; }));
            y.domain([0, max]);

            svg.selectAll("rect")
              .data(data)
            .enter()
              .append("rect")
              .attr("x", function(d) { return x(d.story); })
              .attr("width", x.rangeBand())
              .attr("y", function(d) { return y(d.checkins); })
              .attr("height", function(d) { return height - y(d.checkins); })
              .attr("fill", function(d) {
                return "rgb("+Math.min(Math.floor(d.checkins / max * 200), 200)+", " + Math.floor(200 - d.checkins / max * 200) + ", 0)";
              });

            svg.selectAll("text")
              .data(data)
            .enter()
              .append("text")
              .text(function(d) {
                return d.checkins;
              })
              .attr("text-anchor", "middle")
              .attr("x", function(d, i) {
                return  x(d.story) + x.rangeBand() / 2;
              })
              .attr("y", function(d) {
                return y(d.checkins) + 20;
              })
              .attr("font-family", "sans-serif")
              .attr("font-size", "11px")
              .attr("fill", "white");

            svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
              .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text("Checkins");

            svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis)
              .append("text")
              .attr("y", 16)
              .style("text-anchor", "end")
              .text("Stories");

        });
    };
});

