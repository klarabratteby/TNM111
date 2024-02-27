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

  let data1;
  let data2;
  let weightThreshold1 = 1;
  let weightThreshold2 = 1;

  // Tooltip containers
  const tooltipContainer1 = document.querySelector(".tooltip1");
  const tooltipContainer2 = document.querySelector(".tooltip2");

  // Function to display the graph in SVG
  function displayGraph1(svg, nodes, links, tooltipContainer, weightThreshold) {
    const filteredLinks = links.filter((link) => link.value >= weightThreshold);

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3.forceLink(filteredLinks).id((d) => d.index)
      )
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(400 / 2, 400 / 2));

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
      .on("mouseover", (event, d) =>
        showNodeDetails(event, d, tooltipContainer)
      )
      .on("mouseout", () => hideTooltip(tooltipContainer))
      .on("click", (event, d) => brushLink(d));

    //node.append("title").text((d) => d.name);

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    });
  }

  function displayGraph2(svg, nodes, links, tooltipContainer, weightThreshold) {
    const filteredLinks = links.filter((link) => link.value >= weightThreshold);

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3.forceLink(filteredLinks).id((d) => d.index)
      )
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(400 / 2, 400 / 2));

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
      .on("mouseover", (event, d) =>
        showNodeDetails(event, d, tooltipContainer)
      )
      .on("mouseout", () => hideTooltip(tooltipContainer))
      .on("click", (event, d) => brushLink(d));

    //node.append("title").text((d) => d.name);

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
  async function loadData1(url, svg, tooltipContainer, weightThreshold) {
    try {
      const response = await fetch(url);
      data1 = await response.json();
      svg.selectAll("*").remove();
      displayGraph1(
        svg,
        data1.nodes,
        data1.links,
        tooltipContainer,
        weightThreshold
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function loadData2(url, svg, tooltipContainer, weightThreshold) {
    try {
      const response = await fetch(url);
      data2 = await response.json();
      svg.selectAll("*").remove();
      displayGraph2(
        svg,
        data2.nodes,
        data2.links,
        tooltipContainer,
        weightThreshold
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // Default dataset for svg1
  loadData1(
    "starwars-interactions/starwars-full-interactions-allCharacters.json",
    svg1,
    tooltipContainer1,
    weightThreshold1
  );

  // Default dataset for svg2
  loadData2(
    "starwars-interactions/starwars-full-interactions-allCharacters.json",
    svg2,
    tooltipContainer2,
    weightThreshold2
  );

  // Dropdown menu for dataset1
  const dataset1Select = document.getElementById("dataset1");
  dataset1Select.addEventListener("change", function () {
    const selectedDataset = this.value;
    loadData1(selectedDataset, svg1, tooltipContainer1, weightThreshold1);
  });

  // Dropdown menu for dataset2
  const dataset2Select = document.getElementById("dataset2");
  dataset2Select.addEventListener("change", function () {
    const selectedDataset = this.value;
    loadData2(selectedDataset, svg2, tooltipContainer2, weightThreshold2);
  });

  // Slider 1
  const weightSlider1 = document.getElementById("weightSlider1");
  const weightValue1 = document.getElementById("weightValue1");
  weightValue1.textContent = weightSlider1.value;

  weightSlider1.addEventListener("input", function () {
    weightThreshold1 = +this.value;
    weightValue1.textContent = weightThreshold1;
    svg1.selectAll("*").remove();
    displayGraph1(
      svg1,
      data1.nodes,
      data1.links,
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
    displayGraph2(
      svg2,
      data2.nodes,
      data2.links,
      tooltipContainer2,
      weightThreshold2
    );
  });

  // Function for brushing
  function brushLink(selectedNode) {
    const nodes1 = svg1.selectAll("circle");
    const nodes2 = svg2.selectAll("circle");

    const isHighlighted =
      nodes2.filter((d) => d.name === selectedNode.name).attr("stroke") ===
      "yellow";

    nodes1.attr("stroke", null).attr("r", 5);
    nodes2.attr("stroke", null).attr("r", 5);

    if (!isHighlighted) {
      nodes1.each(function (d) {
        if (d.name === selectedNode.name) {
          d3.select(this).attr("stroke", "yellow").attr("r", 10);
        }
      });

      const correspondingNode = nodes2.filter(
        (d) => d.name === selectedNode.name
      );
      correspondingNode.attr("stroke", "yellow").attr("r", 10);
    } else {
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
