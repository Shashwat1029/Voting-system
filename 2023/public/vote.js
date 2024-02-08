function enterFullScreen() {
  const docElm = document.documentElement;
  if (docElm.requestFullscreen) {
    docElm.requestFullscreen();
  } else if (docElm.mozRequestFullScreen) {
    /* Firefox */
    docElm.mozRequestFullScreen();
  } else if (docElm.webkitRequestFullScreen) {
    /* Chrome, Safari & Opera */
    docElm.webkitRequestFullScreen();
  } else if (docElm.msRequestFullscreen) {
    /* IE/Edge */
    docElm.msRequestFullscreen();
  }
}

function exitFullScreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    /* Chrome, Safari & Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    /* IE/Edge */
    document.msExitFullscreen();
  }
}

function showDialog(message) {
  const dialog = document.getElementById("dialog");
  if (dialog) {
    dialog.textContent = message;
    dialog.style.display = "block";
  }
}

function hideDialog() {
  const dialog = document.getElementById("dialog");
  if (dialog) {
    dialog.style.display = "none";
  }
}

function vote(party) {
  const uniqueId = localStorage.getItem("voterId");
  if (!uniqueId) {
    showDialog("Please log in to vote.");
    return;
  }

  showDialog("Submitting your vote...");

  fetch("/vote", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ uniqueId, party }),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((json) => {
          throw new Error(json.message || "Vote submission failed.");
        });
      }
      return response.json();
    })
    .then((data) => {
      showDialog("Thank you for your vote!");
      disableVotingButtons();

      // Redirect to another page after 5 seconds
      setTimeout(() => {
        window.location.href = "/results.html"; // Replace with your desired page
      }, 5000); // 5000 milliseconds = 5 seconds
    });
}

function disableVotingButtons() {
  const buttons = document.querySelectorAll(".my-button");
  buttons.forEach((button) => (button.disabled = true));
}

// Adding event listeners to voting buttons
document.querySelectorAll(".my-button").forEach((button) => {
  button.addEventListener("click", function () {
    vote(this.getAttribute("data-party"));
  });
});
