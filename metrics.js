let activeDistanceChart = null;
let activeHeartRateChart = null;
let activeCadenceChart = null;
let activePaceChart = null;

// Fetch data when Tab 2 is shown
document.getElementById("tab2").addEventListener("show", fetchData);

function fetchData() {
  fetch("/getData")
    .then((response) => response.text())
    .then((data) => {
      console.log("Fetched data:", data); // Log the raw data fetched from the server

      const distances = extractDistances(data);
      console.log("Extracted distances:", distances); // Log the extracted distances
      createDistanceChart(distances); // Create the distance chart

      const heartRates = extractHeartRate(data);
      console.log("Extracted heart rates:", heartRates); // Log the extracted heart rates
      createHeartRateChart(heartRates); // Create the heart rate chart

      const cadances = extractCadences(data);
      console.log("Extracted Cadance:", cadances); // Log the extracted Cadance
      createCadenceChart(cadances); // Create the cadence chart

      const paces = extractPaces(data);
      console.log("Extracted Time Data", paces); // Log the extracted Pace
      createPaceChart(paces); // Create Pace chart

      Toastify({
        text: "Data Loaded!",
        duration: 5000,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center`, or `right`
        style: {
          background: "linear-gradient(to right, #50C878, #98FB98)",
        },
      }).showToast();
    })
    .catch((err) => {
      console.error("Error fetching data:", err);
      Toastify({
        text: "Error Loading Data!",
        duration: 5000,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center`, or `right`
        style: {
          background: "linear-gradient(to right, #cc5500, #e3735e)",
        },
      }).showToast();
    });
}

// Function to extract distances from the raw text data
function extractDistances(text) {
  const regex = /Distance:\s*(\d+)/g; // Regex to extract distances

  const distances = [];
  let match;

  // Loop through all matches
  while ((match = regex.exec(text)) !== null) {
    distances.push(parseInt(match[1], 10)); // Push the extracted distance to the array
  }

  return distances; // Return the array of distances
}

// Function to extract heart rates from the raw text data
function extractHeartRate(text) {
  const regex = /Heart Rate:\s*(\d+)/g; // Regex to extract Heart Rate

  const heartRates = []; // Correctly declare the array to store heart rate values
  let match;

  // Loop through all matches
  while ((match = regex.exec(text)) !== null) {
    heartRates.push(parseInt(match[1], 10)); // Push the extracted Heart Rate to the array
  }

  return heartRates; // Return the array of Heart Rate values
}

// Function to extract Cadence from raw text data
function extractCadences(text) {
  const regex = /Cadence:\s*(\d+)/g; // Regex to extract Cadence

  const cadences = []; // Correctly declare the array to store Cadence value
  let match;

  // loop through all matches
  while ((match = regex.exec(text)) !== null) {
    cadences.push(parseInt(match[1], 10)); // Push the extracted Cadence to the array
  }
  return cadences; // Return the array of the Cadence values
}

// Function to extract Pace from raw data
function extractPaces(text) {
  const regex = /Time:\s*(\d+)/g; // Regex to extract Pace

  const paces = []; // Correctly declare the array to store Paces value
  let match;

  // loop through all matches
  while ((match = regex.exec(text)) !== null) {
    paces.push(parseInt(match[1], 10)); // Push the extracted Paces to the array
  }
  return paces; // Return the array of the Paces values
}

// Function to create the distance chart
function createDistanceChart(distances) {
  const ctx = document.getElementById("metricsChartDistance").getContext("2d");

  if (activeDistanceChart) {
    activeDistanceChart.destroy();
  }

  activeDistanceChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: Array.from(
        { length: distances.length },
        (_, i) => `Run ${i + 1}`
      ),
      datasets: [
        {
          label: "Distance (km)",
          data: distances,
          borderColor: "blue",
          backgroundColor: "rgba(0, 0, 255, 0.1)",
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Run Number",
          },
        },
        y: {
          title: {
            display: true,
            text: "Distance (km)",
          },
        },
      },
    },
  });
}

// Function to create the heart rate chart
function createHeartRateChart(heartRates) {
  const ctx = document.getElementById("metricsChartHeartRate").getContext("2d");

  if (activeHeartRateChart) {
    activeHeartRateChart.destroy();
  }

  activeHeartRateChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: Array.from(
        { length: heartRates.length },
        (_, i) => `Run ${i + 1}`
      ),
      datasets: [
        {
          label: "Heart Rate (HR)",
          data: heartRates,
          borderColor: "red",
          backgroundColor: "rgba(255, 0, 0, 0.1)",
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Run Number",
          },
        },
        y: {
          title: {
            display: true,
            text: "Heart Rate (HR)",
          },
        },
      },
    },
  });
}

// Function to create the Cadence chart
function createCadenceChart(cadences) {
  const ctx = document.getElementById("metricsChartCadence").getContext("2d");

  if (activeCadenceChart) {
    activeCadenceChart.destroy();
  }

  activeCadenceChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: Array.from({ length: cadences.length }, (_, i) => `Run ${i + 1}`),
      datasets: [
        {
          label: "Cadence (CD)",
          data: cadences,
          borderColor: "cyan",
          backgroundColor: "rgba(0,128,128,0.1)",
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Run Number",
          },
        },
        y: {
          title: {
            display: true,
            text: "Cadence (CD)",
          },
        },
      },
    },
  });
}

// Function to create the Pace chart
function createPaceChart(paces) {
  const ctx = document.getElementById("metricsChartPace").getContext("2d");

  if (activePaceChart) {
    activePaceChart.destroy();
  }

  activePaceChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: Array.from({ length: paces.length }, (_, i) => `Run ${i + 1}`),
      datasets: [
        {
          label: "Pace",
          data: paces,
          borderColor: "limegreen",
          backgroundColor: "rgba(0,100,0,0.1)",
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Run Number",
          },
        },
        y: {
          title: {
            display: true,
            text: "Pace",
          },
        },
      },
    },
  });
}
