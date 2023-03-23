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

exports.validatePurchase = () => {
  return [
    body('productId').not().isEmpty().withMessage('productId is required'),
    body('productId').isNumeric().withMessage('productId should be an integer'),
    body('quantity').not().isEmpty().withMessage('quantity is required'),
    body('quantity').isNumeric().withMessage('quantity should be an integer'),
    body('quantity').custom(value => {
      if(value <= 0) {
        return Promise.reject('minimum quantity is 1')
      }

      return true;
    }),



  ]
}

exports.validateDeposit = () => {
  return [
    body('deposit').not().isEmpty().withMessage('deposit is required'),
    body('deposit').isNumeric().withMessage('deposit should be an integer'),
    body('deposit').custom(value => {
      if (![5, 10, 20, 50, 100].includes(Number(value))){
        return Promise.reject('Only deposits of 5, 10, 20, 50 and 100 cent coins are allowed')
      }

      return true;
    }),
  ]
}

exports.validateLogin = () => {
  return [
    body('username').not().isEmpty().withMessage('username is required'),
    body('password').not().isEmpty().withMessage('password is required'),
  ]
}

exports.validateSignUp = () => {
  return [
    body('username').not().isEmpty().withMessage('username is required'),
    body('password').not().isEmpty().withMessage('password is required'),
    body('role').not().isEmpty().withMessage('password is required'),
    body('role').custom(value => {
      if(!['seller', 'buyer'].includes(value)){
        return Promise.reject('Only seller and buyer roles are allowed')
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