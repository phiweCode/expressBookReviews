const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {

        if (isValid(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }

    return res.status(404).json({message: "Unable to register user."});
});

public_users.get('/',function (req, res) {
  return res.status(200).json({data: books});
});

public_users.get('/isbn/:isbn',function (req, res) {
  const {isbn} = req.params; 
   const book = books[isbn]; 

   if(!book) res.json({message: "The book with the given isbn was not found"}) 

  return res.status(200).json({data: book});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const { author } = req.params; 

  let booksByAuthor = []

  for(let isbn in books){ 
    if(books[isbn].author == author) booksByAuthor.push(books[isbn]) 
  }

  return res.status(200).json({data: booksByAuthor});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const { title } = req.params;  

   let booksByTitle = {}

  for(let isbn in books){ 
    if(books[isbn].title == title ) booksByTitle = books[isbn]
  }

  return res.status(200).json({data: booksByTitle});

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
