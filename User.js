const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    /** Team leaders / admins sign up; members are added by a leader */
    role: { type: String, enum: ["leader", "member"], required: true },
    /** Only for team members: developer | designer | tester (omit on leaders — do not use null) */
    jobRole: {
      type: String,
      enum: ["developer", "designer", "tester"],
      required: false,
    },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
