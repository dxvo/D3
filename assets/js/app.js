var svgWidth = 1000;
var svgHeight = 550;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 90
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

svg.append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "#DCE3EE");


svg.append("text")
        .attr("x", (width / 2)+ 60)             
        .attr("y", 0 + (margin.top))
        .attr("text-anchor", "middle")  
        .style("font-size", "24px") 
        .style("text-decoration", "underline")  
        .text("Median Income vs Obesity In USA");

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("data.csv").then(function(csvData) {
    csvData.forEach(function(data) {
      data.obesity = +data.obesity;
      data.income = +data.income;
    });

    //Scale functio0n for x and y 
    var xLinearScale = d3.scaleLinear()
      .domain([38000, d3.max(csvData, d => d.income)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([20, d3.max(csvData, d => d.obesity)])
      .range([height, 0]);

    // Create x and y axes 
    var xAxis = d3.axisBottom(xLinearScale);
    var yAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    chartGroup.append("g")
      .call(yAxis);

    // Apend data to chart 
    var circlesGroup = chartGroup.selectAll("circle")
    .data(csvData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.income))
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("r", "12")
    .attr("fill", "#9DA5F0")
    .attr("opacity", ".6")
    .style("stroke", "black");

    // create and add tool tip
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([10, 60])
      .html(function(d) {
        return (`${d.abbr}<br>Income: $${d.income}<br>Obese: ${d.obesity}%`);
      });
    chartGroup.call(toolTip);
    

    // Appending state abbr
    chartGroup.append("text")
        .style("text-anchor", "middle")
        .style("font-size", "8px")
        .selectAll("tspan")
        .data(csvData)
        .enter()
        .append("tspan")
            .attr("x", function(data) {
                return xLinearScale(data.income);
            })
            .attr("y", function(data) {
                return yLinearScale(data.obesity);
            })
            .text(function(data) {
                return data.abbr
            });


    // event listener for tool tip 
    circlesGroup.on("mouseover", function (d) {
            toolTip.show(d, this);
        })

    circlesGroup.on("mouseout", function (d, i) {
            toolTip.hide(d);
        });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "aText")
      .text("Obese (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2.1}, ${height + margin.top+30})`)
      .attr("class", "aText")
      .text("Median Household Income");
  });