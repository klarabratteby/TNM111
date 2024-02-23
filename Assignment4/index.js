document.addEventListener("DOMContentLoaded", function () {
  const width = 400; // Justera bredden vid behov
  const height = 400; // Justera höjden vid behov

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

  let data; // Variabel för att lagra länkdata
  let weightThreshold1 = 1; // Värdet på vikttröskeln
  let weightThreshold2 = 1;

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
        "starwars-interactions/starwars-episode-3-interactions-allCharacters.json"
      );
      data = await response.json();
      displayGraph(svg1, data.nodes, data.links, weightThreshold1);
      displayGraph(svg2, data.nodes, data.links, weightThreshold2);
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

  // Slider 1
  const weightSlider1 = document.getElementById("weightSlider1");
  const weightValue1 = document.getElementById("weightValue1");
  weightValue1.textContent = weightSlider1.value; // Set initial value

  weightSlider1.addEventListener("input", function () {
    weightThreshold1 = +this.value;
    weightValue1.textContent = weightThreshold1;
    svg1.selectAll("*").remove(); // Clear the visualization
    displayGraph(svg1, data.nodes, data.links, weightThreshold1); // Redraw with new threshold
  });

  // Slider 2
  const weightSlider2 = document.getElementById("weightSlider2");
  const weightValue2 = document.getElementById("weightValue2");
  weightValue2.textContent = weightSlider2.value; // Set initial value

  weightSlider2.addEventListener("input", function () {
    weightThreshold2 = +this.value;
    weightValue2.textContent = weightThreshold2;
    svg2.selectAll("*").remove(); // Clear the visualization
    displayGraph(svg2, data.nodes, data.links, weightThreshold2); // Redraw with new threshold
  });
});
