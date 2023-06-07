const express = require("express");
const bcryptjs = require("bcryptjs");
const { default: mongoose } = require("mongoose");

const router = express.Router();

const User = require("../models/User.model");

const saltRounds = 10;

// ROUTES

////Create new account
/////GET /signup
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});
/////POST /signup
router.post("/signup", (req, res, next) => {
  const { email, password } = req.body;
  //////// make sure users fill all mandatory fields:
  if (!email || !password) {
    res.render("auth/signup", {
      errorMessage:
        "All fields are mandatory. Please provide your email and password.",
    });
    return; // finish execution of the current function
  }

  // make sure passwords are strong:
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.status(400).render("auth/signup", {
      errorMessage:
        "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

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
    .then((user) => {
      //account create succcessfully
      req.session.currentUser = {
        _id: user._id,
        email: user.email, //and other user fields if needed
      };
      console.log(
        "SIGNUP SUCCESSFUL LINE 57 auth.routes.js",
        req.session.currentUser
      );
      res.render("auth/user-profile", {
        user: req.session.currentUser,
        authenticated: req.session.currentUser, //can consider to use !! to convert to truthy
      });
    })
    .catch((error) => {
      console.log("error creating account...", error);
      if (error instanceof mongoose.Error.ValidationError) {
        console.log("this is a mongoose validator error");
        res.status(400).render("auth/signup", {
          errorMessage: error.message,
        }); //this error message will be in the mongoose model });
      } else if (error.code === 11000) {
        res
          .status(400)
          .render("auth/signup", { errorMessage: "Email needs to be unique." });
      } else {
        console.log("this is NOT a mongoose validator error");
        next(error);
      }
      /* if (error instanceof mongoose.Error.ValidationError) {
                console.log("this is a mongoose validator error")
                res.status(400).render('auth/signup', { errorMessage: error.message });
            } else if (error.code === 11000) {
                res.status(400).render('auth/signup', { errorMessage: 'Email needs to be unique.' });
            } else {
                console.log("this is NOT a mongoose validator error")
                next(error)
            } */
    });
});

////Login current account
/////GET /login
router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

/////POST /login
router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.status(400).render("auth/login", {
      errorMessage: "Please enter both, email and password to login.",
    });
    return;
  }
  User.findOne({ email: email }) //key is from the model and the value is from the req.body
    .then((user) => {
      if (!user) {
        //user doesn't exist (mongoose returns "null")
        res.status(400).render("auth/login", {
          errorMessage: "Email is not registered. Try with other email.",
        });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        //login successful
        req.session.currentUser = {
          _id: user._id, // Or user.id
          email: user.email,
        };
        console.log(
          "LOGIN SUCCESSFUL LINE 127 auth.routes.js",
          req.session.currentUser
        );
        res.render("auth/user-profile", {
          user: req.session.currentUser,
          authenticated: req.session.currentUser,
        });
      } else {
        //login failed
        res.status(400).render("auth/login", {
          errorMessage: "Incorrect Credentials.",
        });
      }
    })
    .catch((error) => {
      console.log("error trying to login...", error);
      next(error);
    });
});

/////POST /user-profile
router.post("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    //session.destroy return a function
    if (err) next(err);
    res.redirect("/"); // if logout sucessful, redirect to homepage
  });
});
/////GET /user-profile
router.get("/user-profile", (req, res, next) => {
  res.render("auth/user-profile", {
    user: req.session.currentUser,
    authenticated: req.session.currentUser,
  });
});
module.exports = router;
