document.getElementById("regButton").addEventListener("click", function () {
  const name = document.getElementById("regName").value;
  const dob = document.getElementById("regDob").value;
  const pinCode = document.getElementById("regPinCode").value;

  fetch("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, dateOfBirth: dob, pinCode }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.uniqueId) {
        alert("Registration successful. Your Voter ID: " + data.uniqueId);
        // Redirect to login page
        window.location.href = "login.html";
      } else {
        alert("Registration failed. Please try again.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Registration failed: " + error.message);
    });
});
