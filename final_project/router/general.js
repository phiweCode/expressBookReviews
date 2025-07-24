const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      users.push({ username, password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }

  return res.status(404).json({ message: "Unable to register user." });
});

public_users.get('/', (req, res) => {
  const getBooks = new Promise((resolve, reject) => {
    resolve(books);
  });

  getBooks
    .then((bookList) => res.status(200).json({ data: bookList }))
    .catch(() => res.status(500).json({ message: "Failed to fetch books" }));
});


public_users.get('/isbn/:isbn', (req, res) => {
  const { isbn } = req.params;

  const getBookByISBN = new Promise((resolve, reject) => {
    if (books[isbn]) resolve(books[isbn]);
    else reject("Book not found");
  });

  getBookByISBN
    .then((book) => res.status(200).json({ data: book }))
    .catch((err) => res.status(404).json({ message: err }));
});


public_users.get('/author/:author', (req, res) => {
  const { author } = req.params;

  const getBooksByAuthor = new Promise((resolve, reject) => {
    let results = [];

    for (let isbn in books) {
      if (books[isbn].author === author) results.push(books[isbn]);
    }

    resolve(results);
  });

  getBooksByAuthor
    .then((books) => res.status(200).json({ data: books }))
    .catch(() => res.status(500).json({ message: "Could not find books by author" }));
});


public_users.get('/title/:title', (req, res) => {
  const { title } = req.params;

  const getBookByTitle = new Promise((resolve, reject) => {
    let result = null;

    for (let isbn in books) {
      if (books[isbn].title === title) {
        result = books[isbn];
        break;
      }
    }

    if (result) resolve(result);
    else reject("Book not found by title");
  });

  getBookByTitle
    .then((book) => res.status(200).json({ data: book }))
    .catch((err) => res.status(404).json({ message: err }));
});


public_users.get('/review/:isbn', (req, res) => {
  const { isbn } = req.params;

  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).json({ reviews: book.reviews });
});

module.exports.general = public_users;
