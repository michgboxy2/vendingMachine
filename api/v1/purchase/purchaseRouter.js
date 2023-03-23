"use strict";

const express = require('express');
const  router = express.Router();
const { validateProduct, validate, validatePurchase } = require('../utils/validator');
const { makePurchase } = require('./purchaseController');
const { authenticate, checkBuyer, checkSeller } = require('../auth/authorization');


router.route('/buy')
.post(validatePurchase(), validate, authenticate, checkBuyer, makePurchase);


module.exports = router;
