//const data = require("./starwars-interactions/starwars-full-interactions-allCharacters.json");
//console.log(data);

// Define nodeDiagram function
function nodeDiagram(svg, nodes, links) {
  var width = 600,
    height = 400;

  var simulation = d3
    .forceSimulation(nodes)
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2))
    .on("tick", ticked);

  var info = d3.select("body").append("div").attr("class", "info");

  var link = svg.selectAll(".link").data(links);
  var node = svg.selectAll(".node").data(nodes);

  function createLinks() {
    link = link.data(links);
    link.exit().remove();
    link = link
      .enter()
      .append("line")
      .attr("class", "link")
      .merge(link)
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);
  }

  function ticked() {
    var u = svg
      .selectAll(".node")
      .data(nodes)
      .join("circle")
      .attr("class", "node")
      .attr("r", 5)
      .attr("cx", function (d) {
        return d.x;
      })
      .attr("cy", function (d) {
        return d.y;
      });
  }
}

// Load Star Wars data using d3.json
d3.json(
  "./starwars-interactions/starwars-full-interactions-allCharacters.json",
  function (error, data) {
    if (error) {
      console.error("Error loading data:", error);
      return;
    }

    console.log("Loaded data:", data); // Log the fetched JSON data

    var links = data.links;
    var nodes = data.nodes;

    // Select SVG element
    var svg = d3.select("#visualization");

    if (svg.empty()) {
      console.error("SVG element not found.");
      return;
    }

    // Call nodeDiagram function
    nodeDiagram(svg, nodes, links);
  }
);
