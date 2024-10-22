// routes/expenseRoutes.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const {
  createExpense,
  getexpensezes,
  getexpenseDetails,
  editExpense,
  deleteExpense,
} = require('../controllers/expenseController');

const router = express.Router();

// Create expense
router.post(
  '/',
  [
    body('amount').isNumeric().withMessage('Amount must be a number').notEmpty().withMessage('Amount is required'),
    body('sharedWith').isArray().withMessage('sharedWith must be an array').notEmpty().withMessage('sharedWith is required'),
    body('sharedWith.*.userId').isString().withMessage('User ID must be a string').notEmpty().withMessage('User ID is required'),
    body('sharedWith.*.amountOwed').isNumeric().withMessage('Amount owed must be a number').notEmpty().withMessage('Amount owed is required'),
    body('sharedWith.*.percentage').isNumeric().withMessage('Percentage must be a number').notEmpty().withMessage('Percentage is required'),
    body('method').isString().withMessage('Method must be a string').notEmpty().withMessage('Method is required'),
    body('createdBy').isString().withMessage('Creator ID must be a string').notEmpty().withMessage('Creator ID is required'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  createExpense
);

// Get all expenses
router.get('/', getexpensezes);

// Get expense details
router.get('/:id', getexpenseDetails);

// Edit expense
router.put(
  '/:id',
  [
    body('amount').isNumeric().withMessage('Amount must be a number').notEmpty().withMessage('Amount is required'),
    body('sharedWith').isArray().withMessage('sharedWith must be an array').notEmpty().withMessage('sharedWith is required'),
    body('sharedWith.*.userId').isString().withMessage('User ID must be a string').notEmpty().withMessage('User ID is required'),
    body('sharedWith.*.amountOwed').isNumeric().withMessage('Amount owed must be a number').notEmpty().withMessage('Amount owed is required'),
    body('sharedWith.*.percentage').isNumeric().withMessage('Percentage must be a number').notEmpty().withMessage('Percentage is required'),
    body('method').isString().withMessage('Method must be a string').notEmpty().withMessage('Method is required'),
    body('createdBy').isString().withMessage('Creator ID must be a string').notEmpty().withMessage('Creator ID is required'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  editExpense
);

router.delete('/:id', deleteExpense);

module.exports = router;
