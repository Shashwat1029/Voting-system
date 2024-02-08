require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const Vote = require("./models/vote");
const User = require("./models/user");

const app = express();
const port = 3000;
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/VoteDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());

app.use(
  session({
    secret: "process.env.SESSION_SECRET",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);
function restrictAfterVote(req, res, next) {
  if (req.session.voted) {
    res.status(403).send("Access denied. You have already voted.");
  } else {
    next();
  }
}

app.use("/register", restrictAfterVote);
app.use("/login", restrictAfterVote);
app.use("/vote", restrictAfterVote);

app.post("/register", async (req, res) => {
  const { name, dateOfBirth, pinCode } = req.body;
  const uniqueId = generateUniqueId(dateOfBirth, pinCode);

  const newUser = new User({ name, dateOfBirth, pinCode, uniqueId });
  try {
    await newUser.save();
    res.json({ message: "Registration successful", uniqueId: uniqueId });
  } catch (error) {
    res.status(500).send("Error in registration: " + error.message);
  }
});

app.post("/login", async (req, res) => {
  const { uniqueId, dateOfBirth } = req.body;
  try {
    const user = await User.findOne({ uniqueId, dateOfBirth });
    if (user) {
      req.session.user = user;
      req.session.voted = false;

      res.json({ success: true, message: "Login successful." });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Login failed. User not found." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error: " + error.message });
  }
});

// Voting endpoint
app.post("/vote", async (req, res) => {
  const { uniqueId, party } = req.body;

  // Check session for vote status
  if (req.session.voted) {
    return res.status(400).send("This user has already voted.");
  }

  // Validate incoming data
  if (!uniqueId) {
    return res.status(400).send("Unique ID is required.");
  }
  if (!party) {
    return res.status(400).send("Party is required.");
  }

  try {
    // Check if this unique ID has already voted
    const existingVote = await Vote.findOne({ uniqueId });
    if (existingVote) {
      return res.status(400).send("This ID has already voted.");
    }

    // Record the new vote
    const newVote = new Vote({ uniqueId, party });
    await newVote.save();

    // Mark the session as voted
    req.session.voted = true;

    res.json({ message: "Vote recorded", party });
  } catch (error) {
    console.error("Error saving vote:", error);
    res.status(500).send("Error processing your vote.");
  }
});
app.get("/results.html", (req, res) => {
  res.sendFile(__dirname + "/path/to/results.html"); // Update with the correct path
});

// Results endpoint
app.get("/results", async (req, res) => {
  const results = await Vote.aggregate([
    { $group: { _id: "$party", count: { $sum: 1 } } },
  ]);
  res.json(results.map((r) => ({ party: r._id, count: r.count })));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

function generateUniqueId(dateOfBirth, pinCode) {
  const dob = new Date(dateOfBirth);
  const yearOfBirth = dob.getFullYear();
  const firstFourPin = pinCode.substring(0, 4);
  const randomDigits = Math.floor(Math.random() * 90000) + 10000;
  return `${yearOfBirth}${firstFourPin}${randomDigits}`;
}
