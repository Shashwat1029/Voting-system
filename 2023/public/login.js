document.getElementById("loginButton").addEventListener("click", function () {
  const uniqueId = document.getElementById("loginUniqueId").value;
  const dob = document.getElementById("loginDob").value;

  fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uniqueId, dateOfBirth: dob }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // Correctly handling login
        localStorage.setItem("voterId", uniqueId); // Storing the unique ID
        window.location.href = "vote.html"; // Redirecting to voting page
      } else {
        alert("Login failed. Please try again.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Login failed: " + error.message);
    });
});
