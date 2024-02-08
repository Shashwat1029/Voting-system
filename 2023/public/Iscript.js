document.addEventListener("DOMContentLoaded", function () {
  var checkbox = document.getElementById("acknowledgeCheckbox");
  var button = document.getElementById("proceedButton");

  checkbox.addEventListener("change", function () {
    button.disabled = !this.checked;
  });

  button.addEventListener("click", function () {
    if (checkbox.checked) {
      window.location.href = "Registration.html"; // Replace with your target URL
    }
  });
});
