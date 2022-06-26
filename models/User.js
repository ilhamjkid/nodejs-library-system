const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    secretToken: {
      type: String,
      default: null,
    },
    isAdmin: {
      type: Boolean,
      default: null,
    },
    profile: {
      position: String,
      code: Number,
      grade: String,
      absen: Number,
      bio: String,
    },
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
