"use strict";

const title = `35 Fastest times up Alpe d'Huez`;

const svg = d3.select("svg");

const width = +svg.attr("width");
const height = +svg.attr("height");
const xValue = d => d.Year;
const render = data => {
  const xAxisLabel = "Year";
  const yValue = d => d.Time;
  const yAxisLabel = "Time";
  const circleRadius = 9;
  const margin = { top: 50, right: 40, bottom: 120, left: 90 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const tooltip = d3
    .select(".chart")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

  const xScale = d3
    .scaleLinear()
    .domain([d3.min(data, d => d.Year), d3.max(data, d => d.Year + 1)])
    .range([0, innerWidth])
    .nice();

  const yScale = d3
    .scaleTime()
    .domain(d3.extent(data, yValue))
    .range([0, innerHeight])
    .nice();

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const xAxis = d3
    .axisBottom(xScale)
    .tickSize(-innerHeight)
    .tickPadding(20)
    .tickFormat(d3.format("d"));

  const yAxis = d3
    .axisLeft(yScale)
    .tickSize(-innerWidth)
    .tickPadding(10)
    .tickFormat(d3.timeFormat("%M:%S"));

  const yAxisG = g
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis");

  yAxisG.selectAll(".domain").remove();

  yAxisG
    .append("text")
    .attr("class", "axis-label")
    .attr("y", -75)
    .attr("x", -innerHeight / 2)
    .attr("fill", "black")
    .attr("transform", `rotate(-90)`)
    .attr("text-anchor", "middle")
    .text(yAxisLabel);

  const xAxisG = g
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", `translate(0,${innerHeight})`);

  xAxisG.select(".domain").remove();

  xAxisG
    .append("text")
    .attr("class", "axis-label")
    .attr("y", 65)
    .attr("x", innerWidth / 2)
    .text(xAxisLabel);

  g.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cy", d => yScale(yValue(d)))
    .attr("cx", d => xScale(xValue(d)))
    .attr("data-xvalue", function(d) {
      return d.Year;
    })
    .attr("data-yvalue", function(d) {
      return d.Time.toISOString();
    })
    .style("fill", d => (d.Doping === "" ? "green" : "red"))
    .attr("r", circleRadius)
    .on("mouseover", (d, i) => {
      tooltip.style("opacity", 0.9);
      tooltip
        .html(
          `
       <p><strong>${d.Name}</strong>, ${d.Nationality}</p>
       <p>
       Place: ${d.Place},
       Time: ${d.Time.getMinutes()}:${d.Time.getSeconds()},
       Year: ${d.Year}
       </p>
       ${d.Doping === "" ? "" : "<br/><p><em>" + d.Doping + "</em></p>"}
       `
        )
        .attr("data-year", d.Year)
        .style("left", xScale(xValue(d)) + "px")
        .style("top", yScale(yValue(d)) + "px")
        .style("transform", `translate(130px,20px)`);
    })
    .on("mouseout", d => {
      tooltip.style("opacity", 0);
    });

  g.append("text")
    .attr("class", "title")
    .attr("y", -20)
    .attr("x", innerWidth / 2)
    .attr("text-anchor", "middle")
    .text(title);

  const legend = g
    .append("g")
    .attr("id", "legend")
    .style("transform", `translate(550px,${innerHeight + margin.bottom - 10}px)`);

  legend.append("text").text("Legend:");

  legend
    .append("circle")
    .attr("cy", -circleRadius / 2)
    .attr("cx", 100)
    .style("fill", "red")
    .attr("r", circleRadius);

  legend
    .append("text")
    .attr("class", "legend")
    .text("doping")
    .style("transform", `translate(120px,0px)`);

  legend
    .append("circle")
    .attr("cy", -circleRadius / 2)
    .attr("cx", 200)
    .style("fill", "green")
    .attr("r", circleRadius);

  legend
    .append("text")
    .attr("class", "legend")
    .text("no doping")
    .style("transform", `translate(220px,0px)`);
};

d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
).then(data => {
  data.forEach(d => {
    const splittedTime = d.Time.split(":");

    d.Time = new Date(2000, 1, 1, 0, splittedTime[0], splittedTime[1]);
    d.Year = +d.Year;
  });

  render(data);
});
