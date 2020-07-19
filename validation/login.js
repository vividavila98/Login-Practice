const Validator = require("validator");
const isEmpty = require("is-empty");

// Validate if the inputs on the registration form are valid
module.exports = function validateLoginInput(data) {
    // Store error messages for each input 
    // Could include email and password
    let errors = {};

    // If something is inputted, keep data
    // If the field is empty, convert to string because validator
    // can only check strings 
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";

    // Check if email is empty through validator
    // Then check if it's the right format
    if (Validator.isEmpty(data.email)) {
        errors.email = "Email field is required";
    } else if (!Validator.isEmail(data.email)) {
        errors.email = "Email is invalid";
    }

    // Check if password field is empty
    if (Validator.isEmpty(data.password)) {
        errors.password = "Password field is required";
    }

    return {
        errors: errors, // Return errors object
        isValid: isEmpty(errors) // If errors object is filled, form is not valid
    }
};
