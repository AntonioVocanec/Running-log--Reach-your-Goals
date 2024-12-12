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
      console.log("Fetched data:", data);

      const distances = extractDistances(data);
      console.log("Extracted distances:", distances);
      createDistanceChart(distances);

      const heartRates = extractHeartRate(data);
      console.log("Extracted heart rates:", heartRates);
      createHeartRateChart(heartRates);

      const cadences = extractCadences(data);
      console.log("Extracted cadences:", cadences);
      createCadenceChart(cadences);

      const paces = extractPaces(data);
      console.log("Extracted paces:", paces);
      createPaceChart(paces);

      // Extract comments and update the global array
      comments = extractComments(data);
      console.log("Extracted comments:", comments);

      // Extract Effort and update the global array
      efforts = extractEfforts(data);
      console.log("Extracted Effort:", efforts);

      Toastify({
        text: "Data Loaded!",
        duration: 5000,
        gravity: "top",
        position: "right",
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
        gravity: "top",
        position: "right",
        style: {
          background: "linear-gradient(to right, #cc5500, #e3735e)",
        },
      }).showToast();
    });
}

// Function to extract Effort from raw text data
function extractEfforts(text) {
  const regex = /Effort:\s*([^,]*)/g; // Match everything after "Effort:"
  const efforts = []; // Initialize an array for Effort
  let match;

  // Loop through all matches
  while ((match = regex.exec(text)) !== null) {
    efforts.push(match[1].trim()); // Add the trimmed Effort text
  }
  return efforts; // Return the Effort array
}

// Function to extract comments from raw text data
function extractComments(text) {
  const regex = /Comments:\s*(.*)/g; // Match everything after "Comments:"
  const comments = []; // Initialize an array for comments
  let match;

  // Loop through all matches
  while ((match = regex.exec(text)) !== null) {
    comments.push(match[1].trim()); // Add the trimmed comment text
  }
  return comments; // Return the comments array
}

// Function to extract distances from the raw text data
function extractDistances(text) {
  const regex = /Distance:\s*([\d.]+)/g; // Match floating-point numbers
  const distances = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    distances.push(parseFloat(match[1])); // Convert to float
  }

  return distances;
}

// Function to extract heart rates from the raw text data
function extractHeartRate(text) {
  const regex = /Heart Rate:\s*(\d+)/g; // Match heart rate
  const heartRates = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    heartRates.push(parseInt(match[1], 10));
  }

  return heartRates;
}

// Function to extract cadences from the raw text data
function extractCadences(text) {
  const regex = /Cadence:\s*(\d+)/g; // Match cadence
  const cadences = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    cadences.push(parseInt(match[1], 10));
  }

  return cadences;
}

// Function to extract paces from the raw text data
function extractPaces(text) {
  const regex = /Time:\s*(\d{1,2}:\d{2})/g; // Match MM:SS format
  const paces = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    paces.push(match[1]); // Keep the MM:SS string
  }

  return paces;
}
let comments = [];
let efforts = [];

function createDistanceChart(distances) {
  const ctx = document.getElementById("metricsChartDistance").getContext("2d");

  // Ensure the chart is destroyed before creating a new one
  if (activeDistanceChart) {
    activeDistanceChart.destroy();
  }

  // Create the chart
  activeDistanceChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: Array.from(
        { length: distances.length },
        (_, i) => `Run ${i + 1}` // Create labels for each run
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
        tooltip: {
          callbacks: {
            label: function (context) {
              const index = context.dataIndex; // Get the index of the hovered point
              const comment = comments[index] || "No comment"; // Access the corresponding comment
              const RE = efforts[index] || "No data"; // Access the corresponding Effort
              const distance = context.raw; // Access the distance value
              return `Distance: ${distance} km | Relative Effort: ${RE} | \nComment: ${comment}`; // Custom tooltip text
            },
          },
        },
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
        tooltip: {
          callbacks: {
            label: function (context) {
              const index = context.dataIndex; // Get the index of the hovered point
              const comment = comments[index] || "No comment"; // Access the corresponding comment
              const RE = efforts[index] || "No data"; // Access the corresponding Effort
              const heartRates = context.raw; // Access the distance value
              return `Heart Rate: ${heartRates} | Relative Effort: ${RE} | \nComment: ${comment}`; // Custom tooltip text
            },
          },
        },
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

// Function to create the cadence chart
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
          backgroundColor: "rgba(0, 128, 128, 0.1)",
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              const index = context.dataIndex; // Get the index of the hovered point
              const comment = comments[index] || "No comment"; // Access the corresponding comment
              const RE = efforts[index] || "No data"; // Access the corresponding Effort
              const cadences = context.raw; // Access the distance value
              return `Cadence: ${cadences} | Relative Effort: ${RE} | \nComment: ${comment}`; // Custom tooltip text
            },
          },
        },
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

// Function to create the pace chart
function createPaceChart(paces) {
  const ctx = document.getElementById("metricsChartPace").getContext("2d");

  if (activePaceChart) {
    activePaceChart.destroy();
  }

  // Convert MM:SS pace format to total seconds for plotting
  const paceInSeconds = paces.map((pace) => {
    const [minutes, seconds] = pace.split(":").map(Number);
    return minutes * 60 + seconds;
  });

  activePaceChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: Array.from({ length: paces.length }, (_, i) => `Run ${i + 1}`), // X-axis labels showing Run numbers
      datasets: [
        {
          label: "Pace (MM:SS)",
          data: paceInSeconds,
          borderColor: "limegreen",
          backgroundColor: "rgba(0, 100, 0, 0.1)",
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: (context) => {
              const totalSeconds = context.raw; // Access the pace value in seconds
              const minutes = Math.floor(totalSeconds / 60); // Convert to minutes
              const seconds = totalSeconds % 60; // Get the remaining seconds
              const paceFormatted = `${minutes}:${seconds
                .toString()
                .padStart(2, "0")}`; // Format pace as MM:SS

              // Get the corresponding comment using the dataIndex
              const index = context.dataIndex;
              const comment = comments[index] || "No comment"; // Use "No comment" as default if no comment exists
              const RE = efforts[index] || "No data"; // Access the corresponding Effort

              return `Pace: ${paceFormatted} | Relative Effort: ${RE} | \nComment: ${comment}`; // Return the formatted label with comment
            },
          },
        },
        legend: {
          display: true,
          position: "top",
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Run Number", // Display "Run Number" on X-axis
          },
        },
        y: {
          title: {
            display: true,
            text: "Pace (MM:SS)", // Display "Pace" on Y-axis
          },
          ticks: {
            // Format Y-axis ticks as MM:SS
            callback: function (value) {
              const minutes = Math.floor(value / 60);
              const seconds = value % 60;
              return `${minutes}:${seconds.toString().padStart(2, "0")}`;
            },
          },
        },
      },
    },
  });
}
