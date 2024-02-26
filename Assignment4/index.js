document.addEventListener("DOMContentLoaded", function () {
  const width = 400;
  const height = 400;

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

  let data;
  let weightThreshold1 = 1;
  let weightThreshold2 = 1;

  // Tooltip containers
  const tooltipContainer1 = document.querySelector(".tooltip1");
  const tooltipContainer2 = document.querySelector(".tooltip2");
  // Function to display the graph in SVG
  function displayGraph(svg, nodes, links, tooltipContainer, weightThreshold) {
    const filteredLinks = links.filter((link) => link.value >= weightThreshold);

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3.forceLink(filteredLinks).id((d) => d.index)
      )
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(400 / 2, 400 / 2)); // Adjust the center force to 400

    const link = svg
      .selectAll("line")
      .data(filteredLinks)
      .enter()
      .append("line")
      .attr("stroke", "black")
      .attr("stroke-width", 1);

    const node = svg
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", 5)
      .attr("fill", (d) => d.colour)
      // Apply details-on-demand on nodes
      .on("mouseover", (event, d) =>
        showNodeDetails(event, d, tooltipContainer)
      )
      .on("mouseout", () => resetNode(event, tooltipContainer))
      // Apply brushing on nodes
      .on("click", (event, d) => brushLink(d));

    node.append("title").text((d) => d.name);

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    });
  }
  // Function to load data from JSON
  async function loadData(url, svg, tooltipContainer, weightThreshold) {
    try {
      const response = await fetch(url);
      data = await response.json();
      // Clear the existing visualizations for the specified SVG container
      svg.selectAll("*").remove();
      // Redraw the graph with the new data
      displayGraph(
        svg,
        data.nodes,
        data.links,
        tooltipContainer,
        weightThreshold
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // Default dataset for svg1
  loadData(
    "starwars-interactions/starwars-full-interactions-allCharacters.json",
    svg1,
    tooltipContainer1,
    weightThreshold1
  );

  // Default dataset for svg2
  loadData(
    "starwars-interactions/starwars-full-interactions-allCharacters.json",
    svg2,
    tooltipContainer2,
    weightThreshold2
  );

  // Dropdown menu for dataset1
  const dataset1Select = document.getElementById("dataset1");
  dataset1Select.addEventListener("change", function () {
    const selectedDataset = this.value;
    loadData(selectedDataset, svg1, tooltipContainer1, weightThreshold1);
  });

  // Dropdown menu for dataset2
  const dataset2Select = document.getElementById("dataset2");
  dataset2Select.addEventListener("change", function () {
    const selectedDataset = this.value;
    loadData(selectedDataset, svg2, tooltipContainer2, weightThreshold2);
  });

  // Slider 1
  const weightSlider1 = document.getElementById("weightSlider1");
  const weightValue1 = document.getElementById("weightValue1");
  weightValue1.textContent = weightSlider1.value;

  weightSlider1.addEventListener("input", function () {
    weightThreshold1 = +this.value;
    weightValue1.textContent = weightThreshold1;
    svg1.selectAll("*").remove();
    displayGraph(
      svg1,
      data.nodes,
      data.links,
      tooltipContainer1,
      weightThreshold1
    );
  });

  // Slider 2
  const weightSlider2 = document.getElementById("weightSlider2");
  const weightValue2 = document.getElementById("weightValue2");
  weightValue2.textContent = weightSlider2.value;

  weightSlider2.addEventListener("input", function () {
    weightThreshold2 = +this.value;
    weightValue2.textContent = weightThreshold2;
    svg2.selectAll("*").remove();
    displayGraph(
      svg2,
      data.nodes,
      data.links,
      tooltipContainer2,
      weightThreshold2
    );
  });
  // Function for brushing
  function brushLink(selectedNode) {
    const nodes1 = svg1.selectAll("circle");
    const nodes2 = svg2.selectAll("circle");

    // Check if the selected node is already highlighted
    const isHighlighted =
      nodes1.filter((d) => d.name === selectedNode.name).attr("stroke") ===
      "yellow";

    // Clear existing selections
    nodes1.attr("stroke", null);
    nodes2.attr("stroke", null);

    // If the selected node is not already highlighted, highlight it
    // Otherwise, remove the highlighting
    if (!isHighlighted) {
      // Highlight selected node in both diagrams based on character name
      nodes1.each(function (d) {
        if (d.name === selectedNode.name) {
          d3.select(this).attr("stroke", "yellow").attr("r", 10);
        } else {
          d3.select(this).attr("r", 5); // Reset node size when not selected
        }
      });

      // Find the corresponding node in svg2 and highlight it based on character name
      const correspondingNode = nodes2.filter(
        (d) => d.name === selectedNode.name
      );
      correspondingNode.attr("stroke", "yellow").attr("r", 10);
    } else {
      // Reset node size when unselected
      nodes1.attr("r", 5);
      nodes2.attr("r", 5);
    }
  }
  // Function for details-on-demand
  function showNodeDetails(event, node, tooltipContainer) {
    let characterName = node.name;
    let numberOfScenes = node.value;
    let tooltipContent = `Character: ${characterName}<br>Number of Scenes: ${numberOfScenes}`;
    displayTooltip(tooltipContent, event.pageX, event.pageY, tooltipContainer);
  }
  // Function to reset node
  function resetNode(event, tooltipContainer) {
    const currentSvg = d3.select(event.target.closest("svg"));
    const isHoveringSameSvg = currentSvg.node() === event.currentTarget;
    if (!isHoveringSameSvg) {
      hideTooltip(tooltipContainer);
    }
  }
  // Function to display tooltip
  function displayTooltip(content, x, y, tooltipContainer) {
    tooltipContainer.innerHTML = content;
    tooltipContainer.style.left = x + "px";
    tooltipContainer.style.top = y + "px";
    tooltipContainer.style.visibility = "visible";
  }
  // Function to hide the tooltip
  function hideTooltip(tooltipContainer) {
    tooltipContainer.style.visibility = "hidden";
  }
});
