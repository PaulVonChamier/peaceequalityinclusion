
/*****************************************/
/*   DRAW BAR CHART - ALREADY COMPLETE   */
/*****************************************/


// Chart area

var margin = {top: 60, right: 20, bottom: 40, left: 80},
    width = $('#chart-area').width() - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

width = width > 600 ? 600 : width;
width = width < 400 ? 400 : width;

var svg = d3.select("#chart-area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// Parse date
var parseDate = d3.timeParse("%Y-%m-%d");


// Scales and axes

var x = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.1);

var y = d3.scaleLinear()
    .range([height, 0]);

var xAxis = d3.axisBottom()
    .scale(x)
    .tickFormat(d3.timeFormat("%Y-%m-%d"));

var yAxis = d3.axisLeft()
    .scale(y);

var xAxisGroup = svg.append("g")
    .attr("class", "x-axis axis");

var yAxisGroup = svg.append("g")
    .attr("class", "y-axis axis");


function renderBarChart(data) {

    // Group data by 'date'
    var nestedData = d3.nest()
        .key(function(d) { return d.date; })
        .rollup(function(leaves) { return leaves.length; })
        .entries(data);

    nestedData.forEach(function(d) {

        d.key = parseDate(d.key);
        d.value = +d.value;
    });

    // Update scale domains
    x.domain(nestedData.map(function(d) { return d.key; }));
    y.domain([0, d3.max(nestedData, function(d) { return d.value; })]);


    // ---- DRAW BARS ----
    var bars = svg.selectAll(".bar")
        .data(nestedData);

    bars.exit().remove();

    bars.enter()
        .append("rect")
        .attr("class", "bar")
        .merge(bars)
        .attr("x", function(d){ return x(d.key); })
        .attr("y", function(d){ return y(d.value); })
        .attr("height", function(d){ return height - y(d.value); })
        .attr("width", x.bandwidth())
        .on("mouseover", function(d) {

            //Get this bar's x/y values, then augment for the tooltip
            var xPosition = margin.left + parseFloat(d3.select(this).attr("x")) + x.bandwidth() / 2;
            var yPosition = margin.top + parseFloat(d3.select(this).attr("y")) / 2 + height/3;

            //Update the tooltip position and value
            d3.select("#tooltip")
                .style("left", xPosition + "px")
                .style("top", yPosition + "px")
                .select("#value")
                .text(d.value);

            //Show the tooltip
            d3.select("#tooltip").classed("hidden", false);
        })
        .on("mouseout", function(d) {

            //Hide the tooltip
            d3.select("#tooltip").classed("hidden", true);
        });;


    // ---- DRAW AXIS ----

    xAxisGroup = svg.select(".x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    yAxisGroup = svg.select(".y-axis")
        .call(yAxis);

    svg.select("text.axis-title").remove();

    svg.append("text")
        .attr("class", "axis-title")
        .attr("x", -5)
        .attr("y", -15)
        .attr("dy", ".1em")
        .style("text-anchor", "end")
        .text("Deliveries");
}