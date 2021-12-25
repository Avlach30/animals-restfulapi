const { validationResult } = require('express-validator');
const Animal = require('../model/post');
const User = require('../model/user');

exports.getPosts = async (req, res, next) => {
  try {
    const totalDocs = await Animal.find().countDocuments();
    const animals = await Animal.find();

    res.status(200).json({
      message: 'Success fetched all animals',
      animals: animals,
      totalData: totalDocs
    });
  }
  catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.createPost = async (req, res, next) => {
  const title = req.body.title;
  const ordo = req.body.ordo;
  const description = req.body.description;

  let creator;

  try {
    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
      const error = new Error('Validation Failed');
      error.statusCode = 422;
      error.data = validationError.array();
      throw error;
    }

    const animal = new Animal({
      title: title,
      description: description,
      ordo: ordo,
      creator: req.userId
    })

    const postResult = await animal.save();
    const user = await User.findById(req.userId);
    creator = user;
    user.posts.push(animal);
    const userResult = await user.save();

    res.status(201).json({
      message: 'Created post about animal succsessfully',
      animal: postResult,
      creator: {
        _id: userResult._id,
        name: userResult.name
      }
    })
  }
  catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }

};


exports.getPost = async (req, res, next) => {
  const animalId = req.params.animalId;

  try {
    const animal = await Animal.findById(animalId);

    if (!animal) {
      const error = new Error('Animal data not found');
      error.statusCode = 404; 
      next(error);
    }

    res.status(200).json({ message: 'Animal data found successfully' , animal: animal});
  }
  catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.updatePost = async (req, res, next) => {
  const animalId = req.params.animalId;

  const title = req.body.title;
  const ordo = req.body.ordo;
  const description = req.body.description;

  try {
    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
      const error = new Error('Validation Failed');
      error.statusCode = 422;
      error.data = validationError.array();
      throw error;
    }

    const animal = await Animal.findById(animalId);
    if (!animal) {
      const error = new Error('Animal data not found');
      error.statusCode = 404;
      throw error;
    }

    if (animal.creator.toString() !== req.userId) {
      const error = new Error('Not authorized!');
      error.statusCode = 403;
      throw error;
    }

    animal.title = title;
    animal.ordo = ordo;
    animal.description = description;

    const result = await animal.save();

    res.status(200).json({
      message: 'Animal data updated successfully',
      animal: result
    })
  }
  catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  const animalId = req.params.animalId;

  try {
    const animal = await Animal.findById(animalId);

    if (!animal) {
      const error = new Error('Animal not found');
      error.statusCode = 404;
      throw error;
    }

    if (animal.creator.toString() !== req.userId) {
      const error = new Error('Not authorized!');
      error.statusCode = 403;
      throw error;
    }

    const deleteResult = await Animal.deleteOne({_id: animalId});
    const user = await User.findById(req.userId);
    user.posts.pull(animalId);
    const result = await user.save();

    res.status(200).json({
      message: 'Animal data deleted successfully',
      animalId: animalId
    })
  }
  catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
