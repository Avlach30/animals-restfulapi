const express = require('express');
const { body } = require('express-validator');

const postController = require('../controller/post');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/animals', postController.getPosts);

router.post(
  '/animal', 
  body('title').trim().not().isEmpty(),
  body('description').trim().not().isEmpty(),
  body('ordo').trim().not().isEmpty(),
  isAuth, postController.createPost);

router.get('/animal/:animalId', postController.getPost);

router.put(
  '/animal/:animalId', 
  body('title').trim().not().isEmpty(),
  body('description').trim().not().isEmpty(),
  body('ordo').trim().not().isEmpty(),
  isAuth, postController.updatePost);

router.delete('/animal/:animalId', isAuth, postController.deletePost);

module.exports = router;
