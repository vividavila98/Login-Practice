const express = require("express");
const router = express.Router(); // middleware
const bcrypt = require("bcryptjs"); // used to hash passwords before we store them in db
const jwt = require("jsonwebtoken"); // used for authorization
const keys = require("../../config/keys");

// Load input validation for registration
const validateRegisterInput = require("../../validation/register");

// Load input validation for login 
const validateLoginInput = require("../../validation/login")

// Load user model
const User = require("../../models/User");

// @route: POST api/users/register
// @description: Register user
// @access: Public
router.post("/register", (req, res) => {
    // Form validation from validateRegisterInput
    const { errors, isValid } = validateRegisterInput(req.body);
    
    // If form isn't valid, send 400 error
    if (!isValid) {
        return res.status(400).json(errors);
    }

    // If the input is valid, use findOne() to see if user exists already
    // by checking the email 
    User.findOne({email: req.body.email})
    .then(user => {
        // if there is a user, return status 400
        // if not, create a new user with data from request
        if (user) {
            return res.status(400).json({email: "Email already exists!"});
        } else {
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });

            // Hash password before saving into mongoDB
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    // if there's no error, store it
                    newUser.password = hash;
                    newUser
                    .save()
                    .then(user => res.json(user))
                    .catch(err => console.error(err));
                });
            });
        }
    });
});