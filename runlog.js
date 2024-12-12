// Handle the fields to accept numbers only
const numberFields = ["#HR", "#cadance", "#time"];
// Loop through each field and apply the "numbers-only" validation
numberFields.forEach((fieldId) => {
  const inputField = document.querySelector(fieldId);

  inputField.onkeydown = (event) => {
    // Allow numbers or Backspace key
    if (isNaN(event.key) && event.key !== "Backspace") {
      event.preventDefault(); // Prevent non-number characters
    }
  };
});

const distanceInput = document.getElementById("d");

distanceInput.addEventListener("input", (event) => {
  // Get the current value of the input
  let value = event.target.value;

  // Replace any character that is not a number or a dot
  value = value.replace(/[^0-9.]/g, "");

  // Ensure only one dot is allowed
  const parts = value.split(".");
  if (parts.length > 2) {
    value = parts[0] + "." + parts.slice(1).join(""); // Keep the first dot, remove others
  }

  // Limit meters to three digits and prevent values > 59
  const [K, M] = value.split(".");
  if (M && parseInt(M) > 999) {
    value = `${K}.999`;
  }

  if (K && parseInt(K) > 560) {
    value = `1`;
  }

  // Update the input value
  event.target.value = value;
});

const paceInput = document.getElementById("time");

paceInput.addEventListener("input", (event) => {
  let value = event.target.value;

  // Remove any invalid characters
  value = value.replace(/[^0-9:]/g, "");

  // Automatically add a colon if the first part is a single digit
  if (value.length === 1 && !value.includes(":")) {
    value += ":";
  }

  // Limit seconds to two digits and prevent values > 59
  const [minutes, seconds] = value.split(":");
  if (seconds && parseInt(seconds) > 59) {
    value = `${minutes}:59`;
  }
  event.target.value = value;
});

const hrInput = document.getElementById("HR");

hrInput.addEventListener("input", (event) => {
  // Get the current input value
  let value = event.target.value;

  // Parse it as an integer
  const heartrate = parseInt(value);

  // Check if it's over 220
  if (!isNaN(heartrate) && heartrate > 220) {
    // Limit the value to 220
    value = `220`;
  }

  // Update the input field value
  event.target.value = value;
});

const cdInput = document.getElementById("cadance");
cdInput.addEventListener("input", (event) => {
  // Get the current input value
  let value = event.target.value;

  // Parse it as an integer
  const heartrate = parseInt(value);

  // Check if it's over 220
  if (!isNaN(heartrate) && heartrate > 220) {
    // Limit the value to 220
    value = `220`;
  }

  // Update the input field value
  event.target.value = value;
});

saveButton.addEventListener("click", (e) => {
  // Explicitly pass the event as 'e'
  // Prevent default form submission
  e.preventDefault();
  // Collect form data using the input IDs
  const distance = document.getElementById("d").value;
  const heartrate = document.getElementById("HR").value;
  const cadance = document.getElementById("cadance").value;
  const time = document.getElementById("time").value;
  const effort = document.getElementById("RE").value;
  const comments = document.getElementById("subject").value;

  // Validate inputs
  if (!distance || !heartrate || !cadance || !time || !comments) {
    // At least one field is empty
    Toastify({
      text: "All fields are required.",
      duration: 3000,
      gravity: "top",
      position: "right",
      style: {
        background: "linear-gradient(to right, #cc5500, #e3735e)",
      },
    }).showToast();
    return null;
  }

  // Prepare data for sending
  const data = {
    distance,
    heartrate,
    cadance,
    time,
    effort,
    comments,
  };

  console.log("Sending data to server:", data); // Debugging info

  // Send data to the server
  fetch("/save", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      // Handle HTTP response status
      if (!response.ok) {
        return response.text().then((errorMessage) => {
          throw new Error(errorMessage); // Throw an error with the server's message
        });
      }
      return response.text(); // Extract success message from response
    })
    .then((message) => {
      // Display success Toastify message
      Toastify({
        text: message,
        duration: 3000,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center`, or `right`
        style: {
          background: "linear-gradient(to right, #50C878, #98FB98)",
        },
      }).showToast();
    })
    .catch((error) => {
      // Display error Toastify message
      Toastify({
        text: error.message || "An error occurred.",
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
          background: "linear-gradient(to right, #cc5500, #e3735e)",
        },
      }).showToast();
    });
});
