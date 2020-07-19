// Passport is authentication middleware for NodeJS
// Passport-jwt authenticates endpoints with a JSON Web Token 

const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("users");
const keys = require("../config/keys");

const options = {}; // options to control how token is extracted from request or verified
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); // looks for JWT in authorization header
options.secretOrKey = keys.secretOrKey; // verifies token signature

// new JWTStrategy(options, verify)
// jwt_payload: object literal containing decoded JWT payload
// done: passport error first callback
module.exports = passport => {
    passport.use(
      new JwtStrategy(options, (jwt_payload, done) => {
        User.findById(jwt_payload.id)
          .then(user => {
            if (user) {
              return done(null, user);
            }
            return done(null, false);
          })
          .catch(err => console.log(err));
      })
    );
  };