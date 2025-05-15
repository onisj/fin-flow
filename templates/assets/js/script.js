// script.js
// ... your existing script ...

// Example of ScrollReveal usage (add to your existing script)
ScrollReveal().reveal(".hero-section", { delay: 200 });
ScrollReveal().reveal(".video-section", { delay: 400 });
ScrollReveal().reveal(".input-section", { delay: 600 });
ScrollReveal().reveal(".pricing-section", { delay: 800 });
ScrollReveal().reveal(".gallery-section", { delay: 1000 });
ScrollReveal().reveal(".challenge-section", { delay: 1200 });
ScrollReveal().reveal(".community-section", { delay: 1400 });
ScrollReveal().reveal("#market-data", { delay: 1600 });
ScrollReveal().reveal("#finance-analytics", { delay: 1800 });
ScrollReveal().reveal("#finance-reports", { delay: 2000 });

document.getElementById("submit-btn").addEventListener("click", async () => {
  const stockSelect = document.getElementById("stock-select");
  const stockInput = document.getElementById("stock-input");
  const submitBtn = document.getElementById("submit-btn");
  const loading = document.getElementById("loading");

  const visualizationSection = document.getElementById(
    "data-visualization-section"
  );
  const visualizationImg = document.getElementById("data-visualization");

  const analysisReportSection = document.getElementById(
    "analysis-report-section"
  );
  const analysisReportDiv = document.getElementById("analysis-report");

  // Get the selected or typed stock
  const selectedStock = stockSelect.value.trim();
  const typedStock = stockInput.value.trim();
  const stockSymbol = typedStock || selectedStock; // Use typed stock if provided

  if (!stockSymbol) {
    alert("Please select or enter a stock to analyze.");
    return;
  }

  submitBtn.disabled = true;
  loading.style.display = "block";

  try {
    const response = await fetch("/analyze-stock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock_symbol: stockSymbol }),
    });

    const data = await response.json();
    console.log("Analysis Response:", data);

    // Display analysis report if available
    if (data.analysis_report) {
      analysisReportDiv.innerHTML = formatMarkdown(data.analysis_report);
      analysisReportSection.style.display = "block";
    }

    // Fetch visualization image if available
    if (data.visualization_path) {
      const imagePath = data.visualization_path.split("/").pop();
      const imageResponse = await fetch(
        `/visualizations/${encodeURIComponent(imagePath)}`
      );

      if (!imageResponse.ok)
        throw new Error("Failed to fetch visualization image");

      const imageBlob = await imageResponse.blob();
      const imageUrl = URL.createObjectURL(imageBlob);

      visualizationImg.src = imageUrl;
      visualizationSection.style.display = "block";
    }
  } catch (error) {
    console.error("Error analyzing stock:", error);
  } finally {
    // Clear the input field and dropdown selection
    stockSelect.value = "";
    stockInput.value = "";

    // Disable the submit button after clearing
    validateInput();

    // Hide loading and re-enable the button
    loading.style.display = "none";
    submitBtn.disabled = false;
  }
});

// Enable/disable submit button based on input
function validateInput() {
  const stockSelect = document.getElementById("stock-select");
  const stockInput = document.getElementById("stock-input");
  const submitBtn = document.getElementById("submit-btn");

  const selectedStock = stockSelect.value.trim();
  const typedStock = stockInput.value.trim();

  submitBtn.disabled = !(selectedStock || typedStock);
}

document
  .getElementById("stock-select")
  .addEventListener("change", validateInput);
document.getElementById("stock-input").addEventListener("input", validateInput);

// Function to format markdown-like text into HTML
function formatMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold
    .replace(/\*(.*?)\*/g, "<em>$1</em>") // Italic
    .replace(/\n/g, "<br>"); // Line Breaks
}
