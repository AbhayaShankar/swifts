const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter Name"],
      min: [2, "Seriously! You have 2 letters in your name..."],
      max: [30, "God! How big is your Name..."],
    },
    email: {
      type: String,
      required: [true, "Please Enter Email"],
      min: [2, "Please Enter a valid Email..."],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please Enter password"],
      min: 6,
      max: 1024,
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
