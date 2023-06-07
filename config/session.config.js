const session = require("express-session"); //this package export a middleware function
const MongoStore = require("connect-mongo");

// since we are going to USE this middleware in the app.js,
// let's export it and have it receive a parameter
module.exports = (app) => {
  // <== app is just a placeholder here
  // but will become a real "app" in the app.js
  // when this file gets imported/required there

  // required for the app when deployed to Heroku (in production)
  app.set("trust proxy", 1);

  // use session
  app.use(
    session({
      secret: process.env.SESS_SECRET, //needs the secret and encrypted so that the cookies info is not exposed to public
      resave: true,
      saveUninitialized: false,
      cookie: {
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, // 24h
      },
      store: MongoStore.create({
        //store the cookies in the db
        mongoUrl:
          process.env.MONGODB_URI ||
          "mongodb://127.0.0.1:27017/library-project",
        ttl: 60 * 60 * 24, // 60sec * 60min * 24h => 1 day
      }),
    })
  );

  //// Make `user` and `authenticated` available in templates
  app.use(function (req, res, next) {
    if (req.session.currentUser) {
      console.log(req.session.currentUser);
      res.locals.user = {
        _id: req.session.currentUser._id,
        email: req.session.currentUser.email,
        // Add other user fields if needed
      };
      res.locals.authenticated = true;
    } else {
      res.locals.user = null;
      res.locals.authenticated = false;
    }
    next();
  });
};
