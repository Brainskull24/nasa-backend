const mongoose = require("mongoose");
const tokenSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: "userModel",
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type:Date,
    default:Date.now(),
    expires:3600,
  }
});

module.exports = mongoose.model("tokenSchema",tokenSchema);