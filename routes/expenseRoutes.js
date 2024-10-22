const express = require('express');
const { body, validationResult } = require('express-validator');
const {
  createExpense,
  getexpensezes,
  getexpenseDetails,
  editExpense,
  deleteExpense,
} = require('../controller/expenseController');

const verifytoken = require("../middleware/isauth.js");
const validation=require("../middleware/validation");

const router = express.Router();
router.use(verifytoken);

router.post(
  '/',
  [
    body('amount').isNumeric().withMessage('Amount must be a number').notEmpty().withMessage('Amount is required'),
    body('sharedWith').isArray().withMessage('sharedWith must be an array').notEmpty().withMessage('sharedWith is required'),
    body('sharedWith.*.userId').isString().withMessage('User ID must be a string').notEmpty().withMessage('User ID is required'),
    body('sharedWith.*.amountOwed').isNumeric().withMessage('Amount owed must be a number').notEmpty().withMessage('Amount owed is required'),
    body('sharedWith.*.percentage').optional().isNumeric().withMessage('Percentage must be a number'),
    body('method').isString().withMessage('Method must be a string').notEmpty().withMessage('Method is required')
  ],
  validation,
  createExpense
);

router.get('/', getexpensezes);

router.get('/:id', getexpenseDetails);

router.put(
  '/:id',
  [
    body('amount').isNumeric().withMessage('Amount must be a number').notEmpty().withMessage('Amount is required'),
    body('sharedWith').isArray().withMessage('sharedWith must be an array').notEmpty().withMessage('sharedWith is required'),
    body('sharedWith.*.userId').isString().withMessage('User ID must be a string').notEmpty().withMessage('User ID is required'),
    body('sharedWith.*.amountOwed').isNumeric().withMessage('Amount owed must be a number').notEmpty().withMessage('Amount owed is required'),
    body('sharedWith.*.percentage').optional().isNumeric().withMessage('Percentage must be a number'),
    body('method').isString().withMessage('Method must be a string').notEmpty().withMessage('Method is required'),
  ],
  validation,
  editExpense
);

router.delete('/:id', deleteExpense);

module.exports = router;
