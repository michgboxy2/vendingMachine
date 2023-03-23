"use strict";

const express = require('express');
const  router = express.Router();
const { validateDeposit, validate } = require('../utils/validator');
const { makeDeposit, reset } = require('./depositController');
const { authenticate, checkBuyer } = require('../auth/authorization');


router.route('/deposit')
.post(
    validateDeposit(), validate, authenticate, checkBuyer, 
    makeDeposit);

router.route('/reset')
.get(authenticate, checkBuyer, reset);



module.exports = router;