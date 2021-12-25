const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../model/user');

exports.signUp = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  try {
    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
      const error = new Error('Validation Failed');
      error.statusCode = 422;
      error.data = validationError.array();
      throw error;
    }

    const hashedPw = await bcrypt.hash(password, 12);
    const user = new User({
      name: name,
      email: email,
      password: hashedPw
    })
    const result = await user.save();

    res.status(201).json({
      message: 'User created succesfully',
      userId: result._id
    });
  }

  catch(error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    let loadUser;

    const user = await User.findOne({email: email});
    if (!user) {
      const error = new Error('Account with this email not found');
      error.statusCode = 401;
      throw error;
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error('Wrong password');
      error.statusCode = 401;
      throw error;
    }

    loadUser = user;
    const token = jwt.sign({
      email: loadUser.email,
      userId: loadUser._id.toString()
    }, 'myultimatesecret', { expiresIn: '1h' });

    res.status(200).json({
      message: 'Login succesfully',
      token: token,
      userId: loadUser._id.toString()
    })

    //console.log(token);
  }
  catch(error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
