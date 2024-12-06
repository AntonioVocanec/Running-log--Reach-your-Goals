const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

// Middleware to parse JSON and serve static files
app.use(express.json());
app.use(express.static(__dirname));

app.get("/getData", (req, res) => {
  const filePath = path.join(__dirname, "runlog.txt");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err.message);
      return res.status(500).send(`Error reading file: ${err.message}`);
    }
    res.send(data);
  });
});

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

// Function to erase the contents of the runlog.txt file
function eraseRunLogFile(req, res) {
  const filePath = "./runlog.txt"; // Ensure this path is correct

  // Clear the file's content by writing an empty string
  fs.writeFile(filePath, "", (err) => {
    if (err) {
      console.error("Error erasing runlog.txt:", err);
      res.status(500).send({ success: false, message: "Failed to erase data" });
    } else {
      console.log("runlog.txt cleared successfully");
      res
        .status(200)
        .send({ success: true, message: "Data erased successfully" });
    }
  });
}

// Route to check if runlog.txt is empty
app.get("/checkFileEmpty", (req, res) => {
  const filePath = "./runlog.txt"; // Ensure this path is correct

  if (!fs.existsSync(filePath)) {
    return res.json({ isEmpty: true, message: "File does not exist." });
  }

  const stats = fs.statSync(filePath);
  if (stats.size === 0) {
    return res.json({
      isEmpty: true,
      message: "No data available!",
    });
  } else {
    //message: "File is not empty."
    return res.json({ isEmpty: false });
  }
});

// Attach the erase function to a POST route
app.post("/eraseRunLog", eraseRunLogFile);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
