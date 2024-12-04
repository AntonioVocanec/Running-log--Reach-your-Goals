// Tab switching logic
const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");
let activeChart;

// Function to show the selected tab
tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const tabId = button.dataset.tab;
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    tabContents.forEach((tab) => {
      tab.style.display = tab.id === tabId ? "block" : "none";
    });

    // Initialize chart in tab2 when it's shown
    if (tabId === "tab2" && !activeChart) {
      fetchData(); // Fetch the data when tab2 is shown
    }
  });
});
