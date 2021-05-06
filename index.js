let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';
let req = new XMLHttpRequest();

let data;
let values = [];

let heightScale;
let xScale;
let xAxisScale;
let yAxisScale;

let width = 800;
let height = 600;
let padding = 40;

let svg = d3.select('svg');

let drawCanvas = () => {
  svg.attr('width', width);
  svg.attr('height', height);
}

let generateScales = () => {
  // Creating a Scale for Bar height.
  heightScale = d3.scaleLinear()
                  .domain([0, d3.max(values, (item) => {
                    return item[1];
                  })])
                  .range([0, height - 2 * padding]);

  // Creating a Scale for placing Bars horizontally.
  xScale = d3.scaleLinear()
                  .domain([0, values.length - 1])
                  .range([padding, width - padding]);

  // Converting the Strings that have the Dates into Numerical Values.
  let datesArray = values.map((item) => {
    return new Date(item[0]);
  })

  // Creating a Scale for the x-axis of Dates.
  xAxisScale = d3.scaleTime()
                  .domain([d3.min(datesArray), d3.max(datesArray)])
                  .range([padding, width - padding]);

  // Creating a Scale for the y-axis of GDP.
  yAxisScale = d3.scaleLinear()
                  .domain([0, d3.max(values, (item) => {
                    return item[1];
                  })])
                  .range([height - padding, padding]);
}

let drawBars = () => {
  // My chart should have a rect element for each data point with a corresponding class="bar" displaying the data.
  svg.selectAll('rect')
      .data(values)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('width', (width - 2 * padding) / values.length);
}

let generateAxis = () => {
  // Both axes should contain multiple tick labels, each with a corresponding class="tick". D3 Bottom and Left take care of that!
  let xAxis = d3.axisBottom(xAxisScale);
  let yAxis = d3.axisLeft(yAxisScale);

  // My chart should have a g element x-axis with a corresponding id="x-axis".
  svg.append('g')
      .call(xAxis)
      .attr('id', 'x-axis')
      .attr('transform', 'translate(0, ' + (height - padding) + ')');

  // My chart should have a g element y-axis with a corresponding id="y-axis".
  svg.append('g')
      .call(yAxis)
      .attr('id', 'y-axis')
      .attr('transform', 'translate(' + (padding) + ', 0)');
}

req.open('GET', url, true);
req.onload = () => {
  data = JSON.parse(req.responseText);
  values = data.data;
  console.log(values);
  drawCanvas();
  generateScales();
  drawBars();
  generateAxis();
}
req.send();