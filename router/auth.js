const express = require('express');
const { body } = require('express-validator');

const User = require('../model/user');
const authController = require('../controller/auth.js');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.post(
  '/signup', 
  body('email').isEmail().withMessage('Enter a valid email')
    .custom( async (value, { req }) => {
      const user = await User.findOne({email: value})
      if (user) {
        return Promise.reject('E-mail address already exist');
      }
    }),
  body('name').trim().not().isEmpty(),
  body('password').trim().isLength({min: 8}),
  authController.signUp);

router.post('/login', authController.login)

module.exports = router;
