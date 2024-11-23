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
document.addEventListener("DOMContentLoaded", () => {
  const saveButton = document.getElementById("saveButton");
  const toastButton = document.getElementById("toastButton");

  toastButton.addEventListener("click", () => {
    console.log("heyidiot");
    Toastify({
      text: "This is a toast notification!",
      duration: 3000, // Display for 3 seconds
      gravity: "top", // Position - top or bottom
      position: "right", // Left, center, or right
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)", // Custom styling
        color: "white",
      },
      close: true, // Show close icon
    }).showToast();
  });

  saveButton.addEventListener("click", () => {
    // Collect form data using the input IDs
    const distance = document.getElementById("d").value;
    const heartrate = document.getElementById("HR").value;
    const cadance = document.getElementById("cadance").value;
    const time = document.getElementById("time").value;
    const relativeEffort = document.getElementById("RE").value;
    const comments = document.getElementById("subject").value;

    // Prepare data for sending
    const data = {
      distance,
      heartrate,
      cadance,
      time,
      relativeEffort,
      comments,
    };

    // Send data to the server
    fetch("/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.text())
      .then((message) => {
        alert(message); // Display success message
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to save data.");
      });
  });
});
