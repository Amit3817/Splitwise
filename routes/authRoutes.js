const express = require("express");
const { body } = require("express-validator");
const verifytoken = require("../middleware/isauth.js");
const validation=require("../middleware/validation")
const mail = require("../middleware/mailer.js");
const {
  signUp,
  logIn,
  otpVerify,
  changePassword,
  forgotPassword,
} = require("../controller/authController.js");

const router = express.Router();

router.post('/signup', [
  body('email', 'Please enter a valid email')
    .normalizeEmail()
    .isEmail()
    .not()
    .isEmpty(),
  body('password', 'Please enter a valid password')
    .trim()
    .isLength({ min: 8 }),
  body('name', 'Please enter a valid name')
    .trim()
    .isLength({ min: 2 }),
], validation,signUp, mail);

router.post('/login', [
  body('email', 'Please enter a valid email')
    .normalizeEmail()
    .isEmail()
    .not()
    .isEmpty(),
  body('password', 'Please enter a valid password')
    .trim()
    .not()
    .isEmpty(),
],validation, logIn);

router.post('/forgot-password', [
  body('email', 'Please enter a valid email')
    .normalizeEmail()
    .not()
    .isEmpty(),
], validation,forgotPassword, mail);

router.post('/verify-otp', [
  body('otp', 'Please enter a valid OTP')
    .not()
    .isEmpty(),
],validation, verifytoken, otpVerify);

router.put('/resend-otp', verifytoken, mail);

router.put('/change-password', [
  body('newPassword', 'Please enter a valid password')
    .not()
    .isEmpty(),
],validation, verifytoken, changePassword);


module.exports = router;
