const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();

app.use(bodyParser.urlencoded({ extended: true })); // Parse form data

// Serve the HTML
app.use(express.static(__dirname));

// Handle the form submission
app.post("/save", (req, res) => {
  const { distance, heartrate, cadance } = req.body;
  const data = `Distance: ${distance}, Heart Rate: ${heartrate}, Cadence: ${cadance}\n`;

  // Save to a file
  fs.appendFile("runlog.txt", data, (err) => {
    if (err) {
      res.status(500).send("Error saving data.");
      return;
    }
    res.send("Data saved successfully!");
  });
});

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
