const { validationResult } = require('express-validator/check');
const Post = require('../models/post');


exports.getPosts = (req, res, next) => {
    Post.find()
        .then(posts => {
            res.status(200)
                .json({message: 'posts fetched successfully', posts: posts});
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.postPost = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect') ;
        error.status = 422;
        throw error;
    }
    const postTitle = req.body.title;
    const postContent = req.body.content;
    const post = new Post({
        title: postTitle,
        content: postContent,
        creator: { name: 'Matan' },
    });
    post.save()
        .then(res => {
            console.log(res);
            res.status(201).json({ 
                message: 'Post Created!',
                post: res
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.getPost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('Post Have not found');
                error.statusCode = 404;
                throw error; // reaches catch block
            }
            res.status(200).json({ message: 'Post Fetched', post: post });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};