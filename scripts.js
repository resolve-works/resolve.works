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

const drawSVGs = (intersectionObserver) => {
  const mediaQuery = window.matchMedia("(min-width: 1024px)");

  if (mediaQuery.matches) {
    [1, 2, 3].forEach((i) => {
      const svg = draw_arrow(i);
      intersectionObserver.observe(svg);
    });
  } else {
    d3.selectAll("main > section:nth-child(3) > ol > li > svg").remove();
  }
};

// Consent functions
function grantAnalyticsConsent() {
  gtag('consent', 'update', {
    'analytics_storage': 'granted'
  });
  localStorage.setItem("analyticsConsent", "granted");
  document.querySelector("main > nav").style.display = "none";
}

function denyAnalyticsConsent() {
  localStorage.setItem("analyticsConsent", "denied");
  document.querySelector("main > nav").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  // Show analytics consent banner if not set
  const analyticsConsent = localStorage.getItem("analyticsConsent");
  if (!analyticsConsent) {
    const banner = document.querySelector("main > nav");
    if (banner) {
      banner.style.display = "block";

      // Handle consent buttons
      const buttons = banner.querySelectorAll("button");
      buttons[0]?.addEventListener("click", grantAnalyticsConsent);
      buttons[1]?.addEventListener("click", denyAnalyticsConsent);
    }
  }

  // Render FAQ from JSON-LD
  const faqScripts = document.querySelectorAll('script[type="application/ld+json"]');
  faqScripts.forEach(script => {
    try {
      const data = JSON.parse(script.textContent);
      if (data["@type"] === "FAQPage" && data.mainEntity) {
        const faqSection = document.querySelector("main > section:nth-child(6)");
        if (faqSection) {
          data.mainEntity.forEach(item => {
            const details = document.createElement("details");
            const summary = document.createElement("summary");
            const answer = document.createElement("p");

            summary.textContent = item.name;
            answer.textContent = item.acceptedAnswer.text;

            details.appendChild(summary);
            details.appendChild(answer);
            faqSection.appendChild(details);
          });
        }
      }
    } catch (e) {
      // Silent fail if JSON is malformed
    }
  });

  const intersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const svg = entry.target;

          const path = d3.select(svg).select("path");
          path.transition().duration(1000).attr("stroke-dashoffset", 0);
          intersectionObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 1 },
  );

  const resizeObserver = new ResizeObserver(() => {
    requestAnimationFrame(() => {
      d3.selectAll("main > section:nth-child(3) > ol > li > svg").remove();
      drawSVGs(intersectionObserver);
    });
  });

  // Initial draw
  drawSVGs(intersectionObserver);

  // Observe the container for resize
  const container = document.querySelector("main > section:nth-child(3) > ol");
  if (container) resizeObserver.observe(container);
});
