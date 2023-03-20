const express = require("express"),
      api = express.Router(),
      userRouter = require('./v1/user/userRouter'),
      productRouter = require('./v1/products/productRouter');



      api.use('/user', userRouter);
      api.use('/product', productRouter);


      module.exports = api;