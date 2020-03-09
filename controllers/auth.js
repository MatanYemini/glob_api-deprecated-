const  { validaionResult } = require('express-validator/check');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.signup = (req, res, next) => {
    const errors = validaionResult(req);
    if(!errors.isEmpty()) {
        const error = new Error('Validation Failed!');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    bcrypt.hash(password, 12)
        .then(hashedPass => {
            const user = new User({
                email: email,
                password: hashedPass,
                name: name
            });
            return user.save();
        })
        .then(result => {
            res.statusCode(201).json({message: 'User created!', userId: result._id});
        })
        .catch(err => {
            if(!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};