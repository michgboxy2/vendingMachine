const { body, validationResult } = require('express-validator');

exports.validateProduct = () => {
    return [
    body('productName').not().isEmpty().trim().withMessage('productName is required'),
    body('amountAvailable').not().isEmpty().withMessage('amountAvailable is required'),
    body('amountAvailable').isNumeric().withMessage('amountAvailable should be an integer'),
    body('cost').isNumeric().withMessage('cost is required'),
    body('cost').custom(value => {
      if(value % 5 != 0 ) {
        return Promise.reject('cost should be in multiples of 5');
      }

      return true;
    }),
    ]
}


exports.validate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next();
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))
  
    return res.status(422).json({
      errors: extractedErrors,
    })
  }