const express = require("express");
const router = express.Router(); //create a class Router

const Author = require("../models/Author.model");
//GET /authors
router.get("/authors", (req, res, next) => {
  Author.find()
    .then((authors) => {
      res.render("authors/authors-list", { authors });
    })
    .catch((e) => {
      console.log("error showing list of authors from DB", e);
      next(e);
    });
});

module.exports = router;
