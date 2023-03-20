"use strict";

const express = require('express'),
      router = express.Router(),
      { signUp, updateUser, getAllUsers, getUser, deleteUser } = require('./userController'),
      { signIn, logout, authenticate } = require('../auth/authorization');


      router.route('/')
      .post(signUp)
      .get(authenticate, getAllUsers);

      router.route('/login')
      .post(signIn);

      router.route('/logout')
      .post(logout);
    
      router.route('/:id')
      .patch(authenticate, updateUser)
      .put(authenticate, updateUser)
      .delete(authenticate, deleteUser);

      router.route('/:username')
      .get(authenticate, getUser);


module.exports = router;