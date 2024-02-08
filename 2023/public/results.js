function fetchResults() {
  fetch("/results")
    .then((response) => response.json())
    .then((data) => {
      // Sort data based on vote count
      data.sort((a, b) => b.count - a.count);

      const resultsTable = document.getElementById("resultsTable");
      let totalVotes = 0;
      let newTableContent = "<tr><th>Party</th><th>Votes</th></tr>";

      // Arrays for the pie chart
      let parties = [];
      let votes = [];

      data.forEach((vote) => {
        totalVotes += vote.count;
        newTableContent += `<tr><td>${vote.party}</td><td>${vote.count}</td></tr>`;

        // Populate arrays for the pie chart
        parties.push(vote.party);
        votes.push(vote.count);
      });

      newTableContent += `<tr><td><strong>Total Votes</strong></td><td><strong>${totalVotes}</strong></td></tr>`;
      resultsTable.innerHTML = newTableContent;

      // Draw the pie chart
      drawPieChart(parties, votes);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
function drawPieChart(parties, votes) {
  var ctx = document.getElementById("myPieChart").getContext("2d");

  let backgroundColors = parties.map(
    (_, index) => `hsl(${(index / parties.length) * 360}, 70%, 50%)`
  );
  let borderColors = parties.map(() => "#FFFFFF");

  new Chart(ctx, {
    type: "pie",
    data: {
      labels: parties,
      datasets: [
        {
          data: votes,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      // Other options as needed
    },
  });
}

// Call fetchResults() immediately, then set an interval for updates
fetchResults();
setInterval(fetchResults, 2000); // Update every 30 seconds
