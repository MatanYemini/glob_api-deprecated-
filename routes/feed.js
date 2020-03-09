const express = require('express');
const feedController = require('../controllers/feed');
const router = express.Router();
const { body } = require('express-validator/check');

// GET /feed/posts
router.get('/posts', feedController.getPosts);

// POST /feed/post
router.post('/post', [
    body('title').trim().isLength({min: 5}),
    body('content').trim().isLength(({min: 5}))
], feedController.postPost);

// GET /feed/post/:postID
router.get('post/:postId', feedController.getPost);

module.exports = router;