// Handle the fields to accept numbers only
const numberFields = ["#HR", "#d", "#cadance", "#time"];
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

const paceInput = document.getElementById("time");

paceInput.addEventListener("input", (event) => {
  let value = event.target.value;

  // Remove any invalid characters
  value = value.replace(/[^0-9:]/g, "");

  // Automatically add a colon if the first part is a single digit
  if (value.length === 1 && !value.includes(":")) {
    value += ":";
  }

  // Limit seconds to two digits and prevent values > 60
  const [minutes, seconds] = value.split(":");
  if (seconds && parseInt(seconds) > 59) {
    value = `${minutes}:59`;
  }
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
  const relativeEffort = document.getElementById("RE").value;
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
    relativeEffort,
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
