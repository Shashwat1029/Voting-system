const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  pinCode: {
    type: String,
    required: true,
  },
  uniqueId: {
    type: String,
    required: true,
    unique: true, // Ensure that the unique ID is unique across all users
  },
});

module.exports = mongoose.model("User", userSchema);
