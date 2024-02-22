document.addEventListener("DOMContentLoaded", function () {
  const width = 200; // Adjust width as needed
  const height = 200; // Adjust height as needed

  const svg1 = d3
    .select("#diagram1")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const svg2 = d3
    .select("#diagram2")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  function displayGraph(svg, nodes, links) {
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3.forceLink(links).id((d) => d.index)
      )
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2));

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
      .attr("fill", (d) => d.colour)
      .on("mouseover", (event, d) => brushLink(d));

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    });
  }

  async function loadData() {
    try {
      const response = await fetch(
        "starwars-interactions/starwars-episode-2-interactions-allCharacters.json"
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

  // Function to handle brushing and linking
  function brushLink(selectedNode) {
    const nodes1 = svg1.selectAll("circle");
    const nodes2 = svg2.selectAll("circle");

    // Clear existing selections
    nodes1.attr("stroke", null);
    nodes2.attr("stroke", null);

    // Highlight selected node in both diagrams
    nodes1.each(function (d) {
      if (d.index === selectedNode.index) {
        d3.select(this).attr("stroke", "yellow");
      }
    });
    nodes2.each(function (d) {
      if (d.index === selectedNode.index) {
        d3.select(this).attr("stroke", "yellow");
      }
    });
  }
});
