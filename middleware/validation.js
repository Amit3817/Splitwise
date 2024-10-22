const { validationResult } = require("express-validator");

const globalValidationMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    return next(error);
  }
  next();
};


module.exports = globalValidationMiddleware;
