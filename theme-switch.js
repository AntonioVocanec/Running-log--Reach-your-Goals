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
