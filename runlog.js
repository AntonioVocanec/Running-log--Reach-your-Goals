//handle the theme switch
document.addEventListener("DOMContentLoaded", () => {
  const switcher = document.getElementById("modeSwitcher");
  const currentMode = localStorage.getItem("theme") || "light";

  switcher.addEventListener("click", () => {
    console.log("Theme switcher clicked!"); // Log each click to the console

    // Toastify notification for succesfull apply of theme, nothing of a big funcion just there to look nice
    Toastify({
      text: "Applied!",
      duration: 1000,
      gravity: "top",
      position: "right",
      style: {
        background: "linear-gradient(to right, #50C878, #98FB98)",
      },
    }).showToast();
  });

  if (currentMode === "dark") {
    document.body.classList.add("dark-mode");
    switcher.textContent = "Switch to Light Mode";
  }
  switcher.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const mode = document.body.classList.contains("dark-mode")
      ? "dark"
      : "light";
    switcher.textContent =
      mode === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode";
    localStorage.setItem("theme", mode);
  });
});

// handle the tab switch
document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons and contents
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      // Add active class to clicked button and associated content
      button.classList.add("active");
      const tabId = button.getAttribute("data-tab");
      document.getElementById(tabId).classList.add("active");
    });
  });
});

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
