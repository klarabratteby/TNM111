//const data = require("./starwars-interactions/starwars-full-interactions-allCharacters.json");
//console.log(data);

document.addEventListener("DOMContentLoaded", function () {
  /** 
  // Create SVG
  const svg = d3
      .select("#visualization")
      .attr("width", 800)
      .attr("height", 600),
    width = +svg.attr("width"),
    height = +svg.attr("height");
  */
  const width = 200; // Adjust width as needed
  const height = 200; // Adjust height as needed
  // Create SVG for the first diagram
  const svg1 = d3
    .select("#diagram1")
    .append("svg")
    .attr("width", width) // Adjust width as needed
    .attr("height", height); // Adjust height as needed

  // Create SVG for the second diagram
  const svg2 = d3
    .select("#diagram2")
    .append("svg")
    .attr("width", width) // Adjust width as needed
    .attr("height", height); // Adjust height as needed

  // Function to display nodes and links
  function displayGraph(svg, nodes, links) {
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3.forceLink(links).id((d) => d.index)
      )
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2));

    simulation.on("tick", () => {
      const link = svg
        .selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .attr("stroke", "black")
        .attr("stroke-width", (d) => Math.sqrt(d.value));

      const node = svg
        .selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("r", (d) => Math.sqrt(d.value))
        .attr("fill", (d) => d.colour);

      link
        .merge(svg.selectAll("line"))
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node
        .merge(svg.selectAll("circle"))
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y);
    });
  }

  // Call displayGraph function
  //displayGraph(data.nodes, data.links);
  async function loadData() {
    try {
      const response = await fetch(
        "starwars-interactions/starwars-episode-7-interactions-allCharacters.json"
      );
      const data = await response.json();
      displayGraph(svg1, data.nodes, data.links);
      displayGraph(svg2, data.nodes, data.links);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // Call loadData function
  loadData();
});
