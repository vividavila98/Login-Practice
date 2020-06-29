const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data) {
    let errors = {};

    // If something is inputted, keep data
    // If the field is empty, convert to string because validator
    // can only check strings 
    data.name = !isEmpty(data.name) ? data.name : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.password2 = !isEmpty(data.password2) ? data.password2 : "";

    // Check if name input field is filled out
    if (Validator.isEmpty(data.name)) {
        errors.name = 'Name field is required'
    }

    // Check if email input field is filled out
    // Then check if it's the right format
    if (Validator.isEmpty(data.email)) {
        errors.email = "Email field is required";
    } else if (!Validator.isEmail(data.email)) {
        errors.email = "Email is invalid, please review it"
    }

    // Check if password input field is filled out
    if (Validator.isEmpty(data.password)) {
        errors.password = "Password field is required";
    }

    // Check if confirm password input field is filled out
    if (Validator.isEmpty(data.password2)) {
        errors.password2 = "Confirm password field is required";
    }

    // Check length of password input field
    if (!Validator.isLength(data.password, {min: 6, max: 30})) {
        errors.password = "Password must be at least 6 characters";
    }

    // Check if passwords match
    if (!Validator.equals(data.password, data.password2)) {
        errors.password2 = "Passwords must match";
    }

    return {
        errors, // return errors object
        isValid: isEmpty(errrors) // if errors object is filled, form is invalid
    }
}