const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    projectName: { type: String, required: true, trim: true },
    projectCode: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },
    startDate: { type: Date },
    deadline: { type: Date },
    status: {
      type: String,
      enum: ["Ongoing", "Pending", "Completed"],
      default: "Pending",
    },
    teamMemberIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    leaderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
