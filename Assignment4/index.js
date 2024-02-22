document.addEventListener("DOMContentLoaded", function () {
<<<<<<< Updated upstream
  const width = 400; // Justera bredden vid behov
  const height = 400; // Justera höjden vid behov
=======
  const width = 200;
  const height = 200;
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
  let data; // Variabel för att lagra länkdata
  let weightThreshold = 1; // Värdet på vikttröskeln

  function displayGraph(svg, nodes, links) {
    const filteredLinks = links.filter((link) => link.value >= weightThreshold);

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3.forceLink(filteredLinks).id((d) => d.index)
      )
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg
      .selectAll("line")
      .data(filteredLinks)
      .enter()
      .append("line")
      .attr("stroke", "black")
      .attr("stroke-width", (d) => Math.sqrt(d.value));

    const node = svg
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", 5) // Använder en fast radie för noderna
      .attr("fill", (d) => d.colour) // Använd färgen från datan
      .on("mouseover", (event, d) => brushLink(d));

    simulation.on("tick", () => {
      link
=======
  function displayGraph(svg, nodes, links, weightThreshold) {
    const filteredLinks = links.filter((link) => link.value >= weightThreshold);

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3.forceLink(filteredLinks).id((d) => d.index)
      )
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2));

    simulation.on("tick", () => {
      const link = svg.selectAll("line").data(filteredLinks);

      link
        .enter()
        .append("line")
        .merge(link)
        .attr("stroke", "black")
        .attr("stroke-width", (d) => Math.sqrt(d.value))
>>>>>>> Stashed changes
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

<<<<<<< Updated upstream
      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
=======
      link.exit().remove();

      const node = svg.selectAll("circle").data(nodes);

      node
        .enter()
        .append("circle")
        .merge(node)
        .attr("r", (d) => Math.sqrt(d.value))
        .attr("fill", (d) => d.colour)
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y);

      node.exit().remove();
>>>>>>> Stashed changes
    });
  }

  async function loadData() {
    try {
      const response = await fetch(
<<<<<<< Updated upstream
        "starwars-interactions/starwars-episode-3-interactions-allCharacters.json"
      );
      data = await response.json();
      displayGraph(svg1, data.nodes, data.links);
      displayGraph(svg2, data.nodes, data.links);
=======
        "starwars-interactions/starwars-episode-7-interactions-allCharacters.json"
      );
      const data = await response.json();
      let weightThreshold = 1; // Default value for weight threshold
      const weightSlider = document.getElementById("weightSlider");
      const weightValue = document.getElementById("weightValue");

      weightSlider.addEventListener("input", function () {
        weightThreshold = +this.value;
        weightValue.textContent = weightThreshold;
        svg1.selectAll("*").remove(); // Clear existing content
        svg2.selectAll("*").remove(); // Clear existing content
        displayGraph(svg1, data.nodes, data.links, weightThreshold);
        displayGraph(svg2, data.nodes, data.links, weightThreshold);
      });

      displayGraph(svg1, data.nodes, data.links, weightThreshold);
      displayGraph(svg2, data.nodes, data.links, weightThreshold);
>>>>>>> Stashed changes
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
<<<<<<< Updated upstream

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
        d3.select(this).attr("stroke", "yellow").attr("r", 10);
      } else {
        d3.select(this).attr("r", 5); // Återställer nodens storlek när den inte är markerad
      }
    });
    nodes2.each(function (d) {
      if (d.index === selectedNode.index) {
        d3.select(this).attr("stroke", "yellow").attr("r", 10);
      } else {
        d3.select(this).attr("r", 5); // Återställer nodens storlek när den inte är markerad
      }
    });
  }

  // Event listener for slider
  const weightSlider = document.getElementById("weightSlider");
  const weightValue = document.getElementById("weightValue"); // Hämta elementet som visar slidervärdet
  weightValue.textContent = weightSlider.value; // Uppdatera det första värdet

  weightSlider.addEventListener("input", function () {
    weightThreshold = +this.value;
    weightValue.textContent = this.value; // Uppdatera slidervärdet som visas

    // Uppdatera diagrammen när slidervärdet ändras
    svg1.selectAll("*").remove(); // Ta bort befintliga element
    svg2.selectAll("*").remove(); // Ta bort befintliga element
    displayGraph(svg1, data.nodes, data.links);
    displayGraph(svg2, data.nodes, data.links);
  });
=======

  loadData();
>>>>>>> Stashed changes
});
