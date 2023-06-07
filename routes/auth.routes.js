const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const saltRounds = 10;
const User = require("../models/User.model");

// ROUTES

////Create new account
/////GET /signup
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});
/////POST /signup
router.post("/signup", (req, res, next) => {
  const { email, password } = req.body;
  ////////before create an account need to encript the password
  bcryptjs
    .genSalt(saltRounds) // this method returns promise
    .then((salt) => {
      return bcryptjs.hash(password, salt);
    }) //this returns hash
    .then((hash) => {
      const newUser = {
        email: email, //key needs to match Model and value needs to match view
        passwordHash: hash,
      };
      return User.create(newUser);
    })
    .then((userFromDB) => {
      //account create succcessfully
      res.redirect("/user-profile");
    })
    .catch((error) => {
      console.log("error creating account...", error);
      next(error);
    });
});

/////GET /user-profile
router.get("/user-profile", (req, res, next) => {
  res.render("auth/user-profile");
});

////Login current account
router.get("/login", (req, res, next) => {
  res.render("auth/login");
});
module.exports = router;
