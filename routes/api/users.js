// users.js handles registration and login 

const express = require("express");
const router = express.Router(); // middleware and routing system
const bcrypt = require("bcryptjs"); // used to hash passwords before we store them in db
const jwt = require("jsonwebtoken"); // used for authorization
const keys = require("../../config/keys");

// Load input validation for registration
const validateRegisterInput = require("../../validation/register");

// Load input validation for login 
const validateLoginInput = require("../../validation/login");

// Load user model
const User = require("../../models/User");

// Registration end point 
// @route: POST api/users/register
// @description: Register user
// @access: Public
router.post("/register", (req, res) => {

    const { errors, isValid } = validateRegisterInput(req.body);
    
    // If form isn't valid, the response is a 400 error
    // that will return the errors object 
    if (!isValid) {
        return res.status(400).json(errors);
    }

    // If the input is valid, use findOne() to see if user exists already
    // by checking the email 
    // findOne: Returns one document that satisfies the 
    // specified query criteria on the collection
    User.findOne({email: req.body.email})
    .then(user => {
        // if there is a user, return status 400 that email exists
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

// Login endpoint
// @route: POST api/users/login
// @description: Login user and return JWT token
// @access: Public

// Validation login form
router.post("/login", (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);

    // Check if form is valid
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password;

    // check to see if there's a user with this email
    User.findOne({ email })
    .then(user => {
        // if there is no user with this email, return error
        if(!user) {
            return res.status(400).json({emailnotfound: "Email not found"});
        }
        // Check if password inputted matches user's password
        bcrypt.compare(password, user.password)
        .then(isMatch => {
            if (isMatch) {
                // passwords match, create JWT Payload
                const payload = {
                    id: user.id,
                    name: user.name
                };
                // Sign token 
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    { expiresIn: 31556926 },
                    (err, token) => {
                        res.json({
                            success: true, 
                            token: "Bearer " + token
                        });
                    }
                );
            } else {
                return res.status(400).json({passwordincorrect: "Password incorrect"});
            }
        });
    });
});

module.exports = router;