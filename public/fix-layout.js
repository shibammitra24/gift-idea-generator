// This script runs on the client to fix any layout issues
(function () {
  // Force layout recalculation
  document.body.style.display = "none";
  document.body.offsetHeight; // Trigger reflow
  document.body.style.display = "";

  // Ensure all main containers are properly centered
  document.addEventListener("DOMContentLoaded", function () {
    const mainContainers = document.querySelectorAll(
      ".max-w-5xl, .max-w-6xl, .max-w-7xl"
    );
    mainContainers.forEach(function (container) {
      container.style.margin = "0 auto";
      container.style.width = "100%";
    });
  });
})();
