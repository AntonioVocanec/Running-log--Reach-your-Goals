document.getElementById("ereaseData").addEventListener("click", () => {
  // Confirm the action with the user
  if (
    confirm(
      "Are you sure you want to erase all your run log data? This action cannot be undone."
    )
  ) {
    fetch("/eraseRunLog", {
      method: "POST", // Make a POST request to your backend
    })
      .then((response) => {
        if (response.ok) {
          Toastify({
            text: "Run log data erased successfully!",
            duration: 3000,
            gravity: "top",
            position: "right",
            style: {
              background: "linear-gradient(to right, #ff5f6d, #ffc371)",
            },
          }).showToast();
        } else {
          Toastify({
            text: "Failed to erase run log data. Try again later.",
            duration: 3000,
            gravity: "top",
            position: "right",
            style: {
              background: "linear-gradient(to right, #cc0000, #ff6666)",
            },
          }).showToast();
        }
      })
      .catch((err) => console.error("Error:", err));
  }
});
