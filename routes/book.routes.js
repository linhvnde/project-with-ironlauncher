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

/* GET /books/create CREATE FORM*/
router.get("/books/create", (req, res, next) => {
  res.render("books/book-create");
});
/* POST /books/create PROCESS FORM */
router.post("/books/create", (req, res, next) => {
  console.log(req.body);
  const newBook = {
    //the data here need to match with the model
    //the properties here match with the input Name in the form
    title: req.body.title,
    description: req.body.description,
    author: req.body.author,
    rating: req.body.rating,
  };

  Book.create(newBook)
    .then((newBook) => {
      console.log(newBook);
      res.redirect("/books");
    })
    .catch((e) => {
      console.log("error creating new book", e);
      next(e);
    });
});
//UPDATE
///GET route to display the form to update a specific book with prefilled info
router.get("/books/:id/edit", (req, res, next) => {
  const bookId = req.params.id;

  Book.findById(bookId)
    .then((bookToEdit) => {
      res.render("books/book-edit", bookToEdit);
    })
    .catch((e) => {
      console.log("error editing a book", e);
      next(e);
    });
});
///POST route to update the info from the form
router.post("/books/:id/edit", (req, res, next) => {
  const bookId = req.params.id;
  const { title, author, description, rating } = req.body;
  Book.findByIdAndUpdate(
    bookId,
    { title, description, author, rating },
    { new: true }
  )
    .then(() => {
      res.redirect("/books");
    })
    .catch((e) => {
      console.log("error post the editing info to a book", e);
      next(e);
    });
});
//DELETE
// router.post("/books/:id/delete", (req, res) => {
  
//   res.redirect("/books")
// })
///POST route to delete by id
/* GET /books/:bookId */
router.get("/books/:bookId", (req, res, next) => {
  const bookId = req.params.bookId;
  // console.log(bookId);
  Book.findById(bookId)
    .then((oneBookFromDB) => {
      //oneBookFromDB is already an object so  in the line 38 dont need the {}
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
