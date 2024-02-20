//const data = require("./starwars-interactions/starwars-full-interactions-allCharacters.json");
//console.log(data);

document.addEventListener("DOMContentLoaded", function () {
  // Data
  const data = {
    nodes: [
      {
        name: "R2-D2",
        value: 171,
        colour: "#bde0f6",
      },
      {
        name: "CHEWBACCA",
        value: 145,
        colour: "#A0522D",
      },
      {
        name: "BB-8",
        value: 40,
        colour: "#eb5d00",
      },
    ],
    links: [
      {
        source: 1,
        target: 0,
        value: 17,
      },
      {
        source: 2,
        target: 0,
        value: 2,
      },
    ],
  };

  // Create SVG
  const svg = d3
      .select("#visualization")
      .attr("width", 800)
      .attr("height", 600),
    width = +svg.attr("width"),
    height = +svg.attr("height");

  // Function to display nodes and links
  function displayGraph(nodes, links) {
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
  displayGraph(data.nodes, data.links);
});
