const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schema to represent User
// Each schema maps to a MongoDB collections and
// defines the shape of the documents/objects 
// within that collection 
// User includes name, email, password, and date
const UserSchema = new Schema ({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// Compile a model
// Models create and read documents from the database 
// first argument: name of collection
module.exports = User = mongoose.model("users", UserSchema);