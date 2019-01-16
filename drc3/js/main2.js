//HOMEWORK #4 - Paul von Chamier




//SVG Size
var width = 700,
    height = 550;
    margin = 20;


//Loading CSV file & Create a local variable
d3.csv("data/zaatari-refugee-camp-population.csv", function(data) {
    var zaatari = [];
    zaatari = data;


//Analyzing the dataset in the web console
    console.log(zaatari);
    console.log("Za'atari Refugee Camp: " + zaatari.length);


//Converting strings to numbers and dates.
    var parseTime = d3.timeParse("%Y-%m-%d");
    for (var k = 0; k < zaatari.length; k++) {
        zaatari[k].date = parseTime(zaatari[k].date);
        zaatari[k].population = Number(zaatari[k].population);
    }


//Adding the first SVG element
    var svg1 = d3.select("div#column1")
        .append("svg")
        .attr("width", width)
        .attr("height", height);



//Creating group element
    var group = svg1.append("g")
        .attr("class", "g")
        .attr("fill-opacity", 0.9)
        .attr("stroke-opacity", 0.12)
        .attr("stroke", 0.6)
        .attr("width", width)
        .attr("height", height)
        .attr("margin", margin);


//Adding the scales for x and y
    var xScale = d3.scaleTime()
        .domain([d3.min(zaatari, function(d) { return d.date; }), d3.max(zaatari, function(d) { return d.date; })])
        .range([margin+25, width - margin-85]);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(zaatari, function(d) { return d.population; })])
        .range([margin, height - margin-35]);

    console.log(d3.min(zaatari, function(d) { return d.population; }));
    console.log(d3.max(zaatari, function(d) { return d.population; }));
    console.log("The range value for the first date in the domain: " + xScale(zaatari[0].date));
    console.log("The range value for the last date in the domain: " + xScale(zaatari[280].date));
    console.log("Dates extent overview: " + d3.extent(zaatari, function(d) { return d.date; }));
    console.log("The range value for the population on the first date in the domain: " + yScale(zaatari[0].population));
    console.log("The range value for the last date in the domain: " + yScale(zaatari[280].population));
    console.log("Population extent overview: " + d3.extent(zaatari, function(d) { return d.population; }));


//Mapping the population data to the chart - Define the function
    var area = d3.area()
        .x(function(d) { return xScale(d.date)+margin; })
        .y1(function(d, i){ return (height- yScale(d.population))})
        .y0(function(d, i){ return (height- margin-15)});


//Mapping the population data to the chart - Draw the area
    var path = group.append("path")
        .datum(zaatari)
        .attr("class", "area")
        .attr("fill", "#FF851B")
        .attr("d", area);


// Create axes with labels placed below the axis
    var xAxis = d3.axisBottom();
    var yAxis = d3.axisLeft();


// Pass the horizontal and vertica axes in the scale function, prepare the ticks modification
    var ticks = [200000, 180000, 160000, 140000, 120000, 100000, 80000, 60000, 40000, 20000, 0];
    var tickLabels = ['0', '20,000', '40,000', '60,000','80,000','10,000','120,000', '140,000', '160,000', '180,000', '200,000'];


    xAxis.scale(xScale)
        .ticks(11);
    svg1.append("g")
        .attr("class", "axisX")
        .attr("transform", "translate("+ (margin) +"," + (height-35) + ")")
        .call(xAxis);

    yAxis.scale(yScale)
        .ticks(9)
        .tickValues(ticks)
        .tickFormat(function(d,i){ return tickLabels[i] });
    svg1.append("g")
        .attr("class", "axisY")
        .attr("transform", "translate(" + (margin+45) + ",27.1)")
        .call(yAxis);


// Creating the labels
    svg1.append("g")
        .append("text")
        .text("Camp Population")
        .attr("class", "labeltop")
        .attr("transform", "translate(0," + margin + ")")
        .attr("x", 2*width/5 )
        .attr("size", "30")
        .attr("y", 15 );

    svg1.append("g")
        .append("text")
        .text("Date")
        .attr("class", "labelx")
        .attr("transform", "translate(0," + (height) + ")")
        .attr("x", width/2 )
        .attr("size", "30")
        .attr("y", 0 );

    svg1.append("g")
        .append("text")
        .text("Population")
        .attr("class", "labely")
        .attr("transform", "rotate(270)")
        .attr("x", -22*width/50 )
        .attr("size", "30")
        .attr("y", 10 );


    // Define the line
    var valueline = d3.line()
        .x(function(d) { return margin + xScale(d.date); })
        .y(function(d) { return height - yScale(d.population); });

    var lineSvg = svg1.append("g");

    var focus = svg1.append("g")
        .style("display", "none");


    // Add the valueline path.
    lineSvg.append("path")
        .attr("class", "line")
        .attr("d", valueline(zaatari));


    // append the circle at the intersection               // **********
    focus.append("circle")                                 // **********
        .attr("class", "y")                                // **********
        .style("fill", "none")                             // **********
        .style("stroke", "black")                           // **********
        .attr("r", 4);                                     // **********


    // append the rectangle to capture mouse               // **********
    bisectDate = d3.bisector(function(d) { return d.date; }).left; // **
    svg1.append("rect")                                     // **********
        .attr("width", width)                              // **********
        .attr("height", height)                            // **********
        .style("fill", "none")                             // **********
        .style("pointer-events", "all")                    // **********
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", mousemove);                       // **********


    function mousemove() {                                 // **********
        var x0 = xScale.invert(d3.mouse(this)[0]),              // **********
            i = bisectDate(zaatari, x0, 1),                   // **********
//            d0 = zaatari[i - 1],                              // **********
            d = zaatari[i];                                 // **********
//            d = x0 - d0.date > d1.date - x0 ? d1 : d0;     // **********
        focus.select("circle.y")                           // **********
//            .data(zaatari)
//            .attr("transform",                             // **********
//                "translate(" + (xScale(d.date)+20) + "," +         // **********
//                (height - yScale(d.population)) + ")");        // **********
    }                                                      // **********


    formatDate = d3.timeFormat("%d-%b");


    // append the x line
    focus.append("line")
        .attr("class", "x")
        .style("stroke", "blue")
        .style("stroke-dasharray", "3,3")
        .style("opacity", 0.5)
        .attr("y1", 0)
        .attr("y2", height-margin);


    // append the y line
    focus.append("line")
        .attr("class", "y")
        .style("stroke", "blue")
        .style("stroke-dasharray", "3,3")
        .style("opacity", 0.5)
        .attr("x1", width/2 - margin)
        .attr("x2", width/2 - margin);


    // place the value at the intersection
    focus.append("text")
        .attr("class", "y1")
        .style("stroke", "white")
        .style("stroke-width", "3.5px")
        .style("opacity", 0.8)
        .attr("dx", 8)
        .attr("dy", "-.3em");
    focus.append("text")
        .attr("class", "y2")
        .attr("dx", 8)
        .attr("dy", "-.3em");


    // place the date at the intersection
    focus.append("text")
        .attr("class", "y3")
        .style("stroke", "white")
        .style("stroke-width", "3.5px")
        .style("opacity", 0.8)
        .attr("dx", 8)
        .attr("dy", "1em");
    focus.append("text")
        .attr("class", "y4")
        .attr("dx", 8)
        .attr("dy", "1em");


    focus.select("circle.y")
        .data(zaatari)
        .attr("transform", function (d) {
            return("translate(" + (xScale(d.date)+20) + "," +
            (height - yScale(d.population)) + ")");
        });

});


// Storing the data on types of shelters and percentages
var shelter = [
    {
        type:'Caravan',
        percentage: 0.7968
    },
    {
        type:'Combination of tents and caravans',
        percentage: 0.1081
    },
    {
        type:'Tents',
        percentage: 0.0951
    }
];
console.log(shelter);


//Adding the second SVG element
var svg2 = d3.select("div#column2")
    .append("svg")
    .attr("width", width/2)
    .attr("height", height);


//Creating group element
var group2 = svg2.append("g")
    .attr("class", "g")
    .attr("fill-opacity", 0.9)
    .attr("stroke-opacity", 1)
    .attr("stroke", 0.6)
    .attr("width", width/2)
    .attr("height", height)
    .attr("margin", margin);


//Adding the scales for x and y
var tickLabels3 = ["Caravan", "Combination of tents and caravans", "Tents"];

var ticks4= [0.16, 0.51, 0.85];
var yScale2 = d3.scaleLinear()
    .domain([0, 1])
    .range([margin, height - margin-55]);
var xScale2 = d3.scaleLinear()
    .domain([0, 1])
    .range([margin, 997*width/2000 - margin]);

//Adding the bar chart
group2.selectAll("rect")
    .data(shelter)
    .enter()
    .append("rect")
    .attr("fill", "#FF851B")
    .attr("x", function(d, index) {
        return (index*106 + 40)
    })
    .attr("y", function(d, index) {
        return (height - margin - 15 - yScale2(shelter[index].percentage))
    })
    .attr("width", 100)
    .attr("height", function(d, index) {
        return (yScale2(shelter[index].percentage))
    });


// Creating the labels
group2.append("g")
    .append("text")
    .text("Type of shelter")
    .attr("class", "labeltop")
    .attr("transform", "translate(0," + margin + ")")
    .attr("x", width/6 )
    .attr("size", "30")
    .attr("y", 15 );


// Create axes with labels placed below the axis
var yAxis2 = d3.axisLeft();
var xAxis2 = d3.axisBottom();

// Pass the horizontal and vertical axes in the scale function, prepare the ticks modification
var ticks2 = [0, 0.5, 1.0];
var tickLabels2 = ['100%','50%','0%'];

var formatPercent = d3.format(".0%");
yAxis2.scale(yScale2)
    .ticks(3)
    .tickValues(ticks2)
    .tickFormat(function(d,i){ return tickLabels2[i] });
group2.append("g")
    .attr("class", "axisY")
    .attr("transform", "translate(" + 40 + ",40)")
    .call(yAxis2);

xAxis2.scale(xScale2)
    .ticks(3)
    .tickValues(ticks4)
    .tickFormat(function(d,i){ return tickLabels3[i] });
group2.append("g")
    .attr("class", "axisX")
    .attr("transform", "translate("+ (margin) +"," + (height-35) + ")")
    .call(xAxis2);


// Adding heights of buildings to the bars
group2.selectAll("text.measures")
    .data(shelter)
    .enter()
    .append("text")
    .attr("fill", "black")
    .attr("class", "measures")
    .text(function(d) {
        return (+(d.percentage*100).toFixed(2) + "%");
    })
    .attr("x", function(d, index) {
        return (index*106 + 68);
    })
    .attr("y", function(d,index) {
        return (height - margin - 20 - yScale2(shelter[index].percentage));
    });