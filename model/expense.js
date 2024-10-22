const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  amount: { type: Number, required: true },

  sharedWith: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      amountOwed: { type: Number, required: true },
      percentage: { type: Number},
    },
  ],

  method: {
    type: String,
    enum: ["equal", "exact", "percentage"],
    required: true,
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }},
  { timestamps: true });

module.exports = mongoose.model("Expense", ExpenseSchema);
