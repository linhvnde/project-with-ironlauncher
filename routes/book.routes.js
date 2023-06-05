const express = require("express");
const router = express.Router(); //create a class Router
const Book = require("../models/Book.model");
/* GET /books */
router.get("/books", (req, res, next) => {
  // const { minRate } = req.query;
  let minRate = Number(req.query.minRate);
  let filter = {};
  if (minRate) {
    filter = { rating: { $gte: minRate } };
  }
  Book.find(filter)
    .then((books) => {
      // console.log(booksFromDB);
      // const data = {
      //   books: booksFromDB,
      // };
      res.render("books/books-list", { books });
    })
    .catch((e) => {
      console.log("error getting book details from DB", e);
      next(e);
    });
});

/* GET /books/:bookId */
router.get("/books/:bookId", (req, res, next) => {
  const bookId = req.params.bookId;
  // console.log(bookId);
  Book.findById(bookId)
    .then((oneBookFromDB) => {//oneBookFromDB is already an object so  in the line 38 dont need the {}
      // res.send(`THIS IS THE ONE BOOK FROM DB:${{ oneBookFromDB }}`);

      // console.log("THIS IS THE BOOK", oneBookFromDB);
      res.render("books/book-details", oneBookFromDB);
    })
    .catch((e) => {
      console.log("error getting list of books from DB", e);
      next(e);
    });
});

module.exports = router;
