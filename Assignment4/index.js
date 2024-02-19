fetch(
  "/Users/klarabratteby/Desktop/Skola/TNM111/Assignment4/starwars-interactions/starwars-full-interactions-allCharacters.json"
)
  .then((response) => response.json())
  .then((data) => {
    var links = data.links;
    var nodes = data.nodes;

    var width = 600,
      height = 400;

    // Diagram
    function nodeDiagram(svg, nodes, links, id) {
      var simulation = d3
        .forceSimulation(nodes)
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2))
        .on("tick", ticked);

      var info = d3.select("body").append("div").attr("class", "info");

      var link = svg.selectAll(".link-" + id);
      var node = svg.selectAll(".node-" + id);

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
    }

    var svg = d3
      .select("#visualization")
      .attr("width", dth)
      .attr("height", height);

    function ticked() {
      var u = svg
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", 5)
        .attr("cx", function (d) {
          return d.x;
        })
        .attr("cy", function (d) {
          return d.y;
        });
    }
  })
  .catch((error) => console.error("Error fetching JSON:", error));
