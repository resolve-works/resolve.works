// D3 Animated Arrow from Diagnose to Prototype
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const draw_arrow = function (index) {
  const svg = d3
    .select(`main > section:nth-child(3) > ol > li:nth-child(${index})`)
    .append("svg");

  const width = svg.node().getBoundingClientRect().width;
  const height = svg.node().getBoundingClientRect().height;

  let startX, startY, endX, endY, controlX, controlY;

  if (index === 2) {
    // Top right to bottom left
    startX = width * 0.4;
    startY = height * 0.12;
    controlY = startY;
    endX = width * 0.75;
    endY = height * 0.6;
    controlX = startX + (endX - startX) * 0.75;
  } else {
    // Bottom left to top right
    startX = width * 0.2;
    startY = height * 0.55;
    endX = width * 0.6;
    endY = height * 0.8;
    controlY = endY;
    controlX = startX + (endX - startX) * 0.25;
  }

  const path = svg
    .append("path")
    .attr("d", `M${startX},${startY} Q${controlX},${controlY} ${endX},${endY}`)
    .attr("stroke", "#D5D5D5")
    .attr("stroke-width", 2)
    .attr("fill", "none");

  const totalLength = path.node().getTotalLength();

  path
    .attr("stroke-dasharray", totalLength + " " + totalLength)
    .attr("stroke-dashoffset", totalLength);

  return svg.node();
};

document.addEventListener("DOMContentLoaded", () => {
  const nodes = [1, 2, 3].map((i) => draw_arrow(i));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const svg = entry.target;

          const path = d3.select(svg).select("path");
          path.transition().duration(1000).attr("stroke-dashoffset", 0);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 1 },
  );

  nodes.forEach((node) => observer.observe(node));
});
