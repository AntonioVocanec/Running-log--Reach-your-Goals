const express = require("express");
const fs = require("fs");
const app = express();

// Middleware to parse JSON data
app.use(express.json());

// Serve static files
app.use(express.static(__dirname));

// Handle the POST request to save data
app.post("/save", (req, res) => {
  const { distance, heartrate, cadance, time, relativeEffort, comments } =
    req.body;

  // Validate that all required fields are present
  if (
    !distance ||
    !heartrate ||
    !cadance ||
    !time ||
    !relativeEffort ||
    !comments
  ) {
    return res.status(400).send("All fields are required.");
  }

  // Format data for saving
  const data = `Distance: ${distance}, Heart Rate: ${heartrate}, Cadence: ${cadance}, Time: ${time}, Relative Effort: ${relativeEffort}, Comments: ${comments}\n`;

  // Append to runlog.txt
  fs.appendFile("runlog.txt", data, (err) => {
    if (err) {
      console.error("Error writing to file:", err);
      return res.status(500).send("Error saving data.");
    }

    console.log("Data saved:", data.trim());
    res.send("Data saved successfully!");
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
