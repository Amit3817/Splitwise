const Expense = require("../model/expense.js");
const User = require("../model/user.js");
const mongoose = require("mongoose");
const { Parser } = require("json2csv");

const createExpense = async (req, res) => {
  try {
    const { amount, sharedWith, method } = req.body;
    const user = req.user;

    for (const friend of sharedWith) {
      const { userId } = friend;

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res
          .status(400)
          .json({ message: `Invalid userId format for user ${userId}` });
      }

      const friendExists = await User.findById(userId);
      if (!friendExists) {
        return res
          .status(404)
          .json({ message: `User with ID ${userId} not found` });
      }
    }

    if (method === "percentage") {
      const totalPercentage = sharedWith.reduce(
        (sum, u) => sum + u.percentage,
        0
      );
      if (totalPercentage !== 100) {
        return res
          .status(400)
          .json({ message: "Percentages must add up to 100%" });
      }
      sharedWith.forEach((user) => {
        user.amountOwed = (user.percentage / 100) * amount;
      });
    } else if (method === "equal") {
      const amountPerUser = amount / sharedWith.length;
      sharedWith.forEach((user) => {
        user.amountOwed = amountPerUser;
        user.percentage = 100 / sharedWith.length;
      });
    } else if (method === "exact") {
      const totalOwed = sharedWith.reduce(
        (sum, user) => sum + user.amountOwed,
        0
      );
      if (totalOwed !== amount) {
        return res.status(400).json({
          message: "Total amounts owed must equal the total expense amount.",
        });
      }
    } else {
      return res.status(400).json({ message: "Invalid split method." });
    }

    const newExpense = await Expense.create({
      amount,
      sharedWith,
      method,
      createdBy: user._id,
    });

    for (const friend of sharedWith) {
      const { userId: friendId, amountOwed: friendAmount } = friend;

      if (friendId.toString() === user._id.toString()) continue;

      const friendUser = await User.findById(friendId);
      const creatorIndex = friendUser.friends.findIndex((f) =>
        f.userId.equals(user._id)
      );
      if (creatorIndex > -1) {
        friendUser.friends[creatorIndex].amount -= friendAmount;
      } else {
        friendUser.friends.push({ userId: user._id, amount: -friendAmount });
      }
      friendUser.expenses = newExpense._id;
      await friendUser.save();

      const friendIndex = user.friends.findIndex((f) =>
        f.userId.equals(friendId)
      );
      if (friendIndex > -1) {
        user.friends[friendIndex].amount += friendAmount;
      } else {
        user.friends.push({ userId: friendId, amount: friendAmount });
      }
    }
    user.expenses = newExpense._id;
    await user.save();

    res.status(201).json(newExpense);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while adding the expense.",
      error: error.message,
    });
  }
};

const getexpensezes = async (req, res, next) => {
  try {
    const expenses = await Expense.find({
      $or: [{ createdBy: req.user._id }, { "sharedWith.userId": req.user._id }],
    });

    if (!expenses || expenses.length === 0) {
      return res.status(404).json({ message: "No expenses found" });
    }

    return res.status(200).json(expenses);
  } catch (err) {
    next(err);
  }
};

const getexpenseDetails = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    console.log(expense);
    console.log(expense.createdBy.toString());
    const isCreator = expense.createdBy.toString() === req.user._id.toString();
    const isSharedWith = expense.sharedWith.some(
      (friend) => friend.userId.toString() === req.user._id.toString()
    );
    console.log(1);

    if (!isCreator && !isSharedWith) {
      return res.status(403).json({ message: "Access denied" });
    }

    return res.status(200).json(expense);
  } catch (err) {
    next(err);
  }
};

const editExpense = async (req, res, next) => {
  const { amount, sharedWith, method } = req.body;
  const user = req.user;

  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    if (expense.createdBy.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You can only edit your own expenses" });
    }
    for (const friend of sharedWith) {
      const { userId } = friend;

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res
          .status(400)
          .json({ message: `Invalid userId format for user ${userId}` });
      }

      const friendExists = await User.findById(userId);
      if (!friendExists) {
        return res
          .status(404)
          .json({ message: `User with ID ${userId} not found` });
      }
    }

    if (method === "percentage") {
      const totalPercentage = sharedWith.reduce(
        (sum, friend) => sum + friend.percentage,
        0
      );
      if (totalPercentage !== 100) {
        return res
          .status(400)
          .json({ message: "Percentages must add up to 100%" });
      }
    }
    if (method === "equal") {
      const amountPerUser = amount / sharedWith.length;
      sharedWith.forEach((friend) => {
        friend.amountOwed = amountPerUser;
        friend.percentage = 100 / sharedWith.length;
      });
    } else if (method === "exact") {
      let totalOwed = 0;
      sharedWith.forEach((friend) => {
        totalOwed += friend.amountOwed;
      });
      if (totalOwed !== amount) {
        return res.status(400).json({
          message: "Total amounts owed must equal the total expense amount.",
        });
      }
    } else if (method === "percentage") {
      sharedWith.forEach((friend) => {
        friend.amountOwed = (friend.percentage / 100) * amount;
      });
    }

    expense.amount = amount;
    expense.sharedWith = sharedWith;
    expense.method = method;

    await expense.save();

    res.status(200).json({ message: "Expense updated successfully", expense });
  } catch (error) {
    next(error);
  }
};

const deleteExpense = async (req, res, next) => {
  try {
    const expenseId = req.params.id;
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: "expense not found" });

    if (!expense.createdBy.equals(new mongoose.Types.ObjectId(req.user._id))) {
      return res.status(403).json({ message: "Unauthorized User" });
    }
    const expensedel = await Expense.findByIdAndDelete(expenseId);

    if (!expensedel) {
      return res.status(404).json({
        success: false,
        message: "expense not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "expense deleted successfully",
      deletedexpenseId: expense._id,
    });
  } catch (err) {
    next(err);
  }
};

const downloadBalanceSheet = async (req, res) => {
  try {
    const userId = req.user.id;

    const expenses = await Expense.find({
      $or: [{ createdBy: userId }, { "sharedWith.userId": userId }],
    });

    if (!expenses || expenses.length === 0) {
      return res
        .status(404)
        .json({ message: "No expenses found for the user." });
    }

    let totalSpent = 0;
    let totalOwed = 0;

    const balanceSheet = expenses.map((expense) => {
      if (expense.createdBy.toString() === userId.toString()) {
        totalSpent += expense.amount;
      }

      const sharedInfo = expense.sharedWith.find(
        (user) =>
          user.userId.toString() === userId.toString() &&
          user.userId.toString() !== userId.toString()
      );

      if (sharedInfo) {
        totalOwed += sharedInfo.amountOwed;
      }
      return {
        expenseId: expense._id,
        amount: expense.amount,
        method: expense.method,
        createdAt: expense.createdAt,
        createdBy: expense.createdBy.toString(),
        totalOwed: sharedInfo ? sharedInfo.amountOwed : 0,
        totalSpent:
          expense.createdBy.toString() === userId.toString()
            ? expense.amount
            : 0,
      };
    });

    const userSummary = {
      userId,
      totalSpent,
      totalOwed,
      netBalance: totalSpent - totalOwed,
    };

    const fields = [
      "expenseId",
      "amount",
      "method",
      "createdAt",
      "totalSpent",
      "totalOwed",
    ];
    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(balanceSheet);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=balance_sheet.csv"
    );

    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({
      message: "Failed to download the balance sheet",
      error: error.message,
    });
  }
};

module.exports = {
  createExpense,
  getexpensezes,
  getexpenseDetails,
  editExpense,
  deleteExpense,
  downloadBalanceSheet,
};
