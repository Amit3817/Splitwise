const mongoose = require("mongoose");

const schema = mongoose.Schema;

const userschema = new schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  expenses: [
    {
      expenseId: { type: mongoose.Schema.Types.ObjectId, ref: "Expense" },
    },
  ],
  friends: [
    {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    amount:{ type: Number,
        default:0
    }
    }
],
  otp: {
    type: String,
  },

  expireotp: {
    type: Date,
  },

  emailverify: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("User", userschema);
