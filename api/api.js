const express = require("express"),
      api = express.Router(),
      userRouter = require('./v1/user/userRouter'),
      productRouter = require('./v1/products/productRouter'),
      purchaseRouter = require('./v1/purchase/purchaseRouter'),
      depositRouter = require('./v1/deposit/depositRouter');


      api.use('/', purchaseRouter);
      api.use('/', depositRouter);
      api.use('/user', userRouter);
      api.use('/product', productRouter);



      module.exports = api;