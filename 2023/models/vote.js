const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  uniqueId: String, // assuming you have this field
  party: {
    type: String,
    required: true, // 'party' is a required field
  },
  votedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Vote", voteSchema);
