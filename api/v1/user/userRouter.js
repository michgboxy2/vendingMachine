"use strict";

const express = require('express'),
      router = express.Router(),
      { validate, validateLogin, validateSignUp } = require('../utils/validator'),
      { signUp, updateUser, getAllUsers, getUser, deleteUser } = require('./userController'),
      { signIn, logout, authenticate, logoutAll } = require('../auth/authorization');


      router.route('/')
      .post(validateSignUp(), validate, signUp)
      .get(authenticate, getAllUsers);

      router.route('/login')
      .post(validateLogin(), validate, signIn);

      router.route('/logout')
      .post(logout);

      router.route('/logout/all')
      .post(logoutAll);
    
      router.route('/:id')
      .patch(authenticate, updateUser)
      .put(authenticate, updateUser)
      .delete(authenticate, deleteUser);

      router.route('/:username')
      .get(authenticate, getUser);


module.exports = router;