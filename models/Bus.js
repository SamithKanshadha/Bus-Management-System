const mongoose = require("mongoose");

const busSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    busNumber: { type: String, required: true, unique: true },
    capacity: { type: Number, required: true },
    features: { type: String, required: true },
    type: { type: String, enum: ["AC", "Non-AC"], required: true },
    
    operator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bus", busSchema);
