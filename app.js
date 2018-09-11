var margin = { top: 20, right: 40, bottom: 80, left: 100 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


// LAYOUT ELEMENTS
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Define the div for the tooltip
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", ".9");


d3.csv("assets/data/data.csv")
    .then(data => {
        // Healthcre vs Poverty
        data.forEach(function (d) {
            d.healthcare = +d.healthcare;
            d.poverty = +d.poverty;
            d.income = +d.income;
            d.obesity = +d.obesity;
        })
   

        // This can all be variable 
        let obesity_stats = data.map(x => x.obesity)
        let poverty_stats = data.map(x => x.poverty)

        var xScale = d3.scaleLinear()
            .domain(d3.extent(obesity_stats))
            .range([0, width])
        let xAxis = d3.axisBottom(xScale)
        
        
        var yScale = d3.scaleLinear()
            
            .domain(d3.extent(poverty_stats))
            .range([width, 0])
        let yAxis = d3.axisLeft(yScale);

         // Initialize tooltip 
        var toolTip = d3
            .tip()
            .attr("class", "tooltip")
            .offset([80, -60])
            .html(function(data) {
                var stateName = d.state;
                var pov = +d.poverty;
                var physAct = +d.healthcare;
                return (
                    stateName + '<br> Poverty: ' + pov + '% <br> Physically Active: ' + physAct +'%'
        );
    });
        
        
        // Generate the X data - 
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(1," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", -6)
            .style("text-anchor", "end")
            .style("fill", "blue")
            .style("font-size", "15px")
            .text("Lacks in Healthcare (%)");
           

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .style("fill", "blue")
            .style("font-size", "15px")
            .text("In Poverty (%)")


        svg.selectAll(".stateCircle")
            .data(data)
            .enter()
            .append("circle")
            .attr("fill", "lightblue")
            .attr("r", "55")
            .attr("class", "box")
          
            .attr("r", "8")
            .attr("cx", d => xScale(d.obesity)) 
            .attr("cy", d => yScale(d.poverty))
            // .style("fill", function (d) { return color(d.species); });

            .on("mouseover", function (d) {
                div.transition()
                    .duration(1000)
                    .style("opacity", .9);
            
                div.html(d.healthcare)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {
                div.transition()
                    .duration(500)
                    .style("opacity", "1");
            });
    //         // Initialize tooltip 
    // var toolTip = d3
    // .tip()
    // .attr("class", "tooltip")
    // .offset([80, -60])
    // .html(function(data) {
    //     var stateName = data.state;
    //     var pov = +data.poverty;
    //     var physAct = +data.phys_act;
    //     return (
    //         stateName + '<br> Poverty: ' + pov + '% <br> Physically Active: ' + physAct +'%'
    //     );
    // });
    });