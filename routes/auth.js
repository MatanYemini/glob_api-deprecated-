const express = require('express');
const { body } = require('express-validator/check');

const authController = require('../controllers/auth');
const User = require('../models/user');
const router = express.Router();

router.put('/signup', [
    body('email')
        .isEmail()
        .withMessage('Please enter valid email')
        .custom((value, { req }) => {
            return User.findOne({email: email})
                .then(userDoc => {
                    if(userDoc) {
                        return Promise.reject('E-Mail is taken!');
                    }
                });
        })
        .normalizeEmail,
        body('password').trim().isLength({min: 5}),
        body('name').trim().not().isEmpty()
    ],
    authController.signup
);

module.exports = router;