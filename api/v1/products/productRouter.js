"use strict";

const express = require('express');
const  router = express.Router();
const { validateProduct, validate } = require('../utils/validator');
const { createProducts, getAllProducts, updateProduct, deleteProduct } = require('./productController');
const { authenticate, checkBuyer, checkSeller } = require('../auth/authorization');

router.route('/')
.post(
    validateProduct(),
    validate,
    authenticate, 
    checkSeller,
    createProducts)

.get(getAllProducts);


router.route('/:id')
.put(authenticate, checkSeller, updateProduct)
.delete(authenticate, checkSeller, deleteProduct);

module.exports = router;