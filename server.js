const express = require("express");
const fs = require("fs");
const app = express();

// Middleware to parse JSON and serve static files
app.use(express.json());
app.use(express.static(__dirname));

// Utility function for validation
const validateData = (data) => {
  const { distance, heartrate, cadance, time, relativeEffort, comments } = data;
  if (
    !distance ||
    !heartrate ||
    !cadance ||
    !time ||
    !relativeEffort ||
    !comments
  ) {
    return "All fields are required.";
  }
  return null;
};

// POST route to save data
app.post("/save", (req, res) => {
  // Validate the request data
  const validationError = validateData(req.body);
  if (validationError) {
    console.warn("Validation error:", validationError);
    return res.status(400).send(validationError); // Client-side error
  }

  // Format the data for saving
  const data = `Distance: ${req.body.distance}, Heart Rate: ${req.body.heartrate}, Cadence: ${req.body.cadance}, Time: ${req.body.time}, Relative Effort: ${req.body.relativeEffort}, Comments: ${req.body.comments}\n`;

  // Append data to runlog.txt
  fs.appendFile("runlog.txt", data, (err) => {
    if (err) {
      console.error("Error writing to file:", err);
      return res.status(500).send("Error saving data."); // Server-side error
    }
    console.log("Data saved successfully:", data.trim());
    res.status(200).send("Data saved successfully!"); // Success response
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
