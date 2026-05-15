const mongoose = require("mongoose");

const jobRequestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [150, "Title must be 150 characters or fewer"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [2000, "Description must be 2000 characters or fewer"],
    },
    category: {
      type: String,
      enum: {
        values: ["Plumbing", "Electrical", "Painting", "Joinery", "General"],
        message: "{VALUE} is not a valid category",
      },
      default: "General",
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    contactName: {
      type: String,
      trim: true,
      default: "",
    },
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator: (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: "Please provide a valid email address",
      },
      default: "",
    },
    status: {
      type: String,
      enum: {
        values: ["Open", "In Progress", "Closed"],
        message: "status must be Open, In Progress, or Closed",
      },
      default: "Open",
    },
  },
  {
    timestamps: true, // adds createdAt + updatedAt automatically
  }
);

// Compound text index for keyword search (bonus)
jobRequestSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("JobRequest", jobRequestSchema);
