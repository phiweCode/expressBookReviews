const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=> !users.some(user=> user.username === username)

const authenticatedUser = (username,password)=>{
 return users.some(user=> user.username === username && user.password === password)
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    if (authenticatedUser(username, password)) {

        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here 
  const { username } = req.session.authorization;  
  const { isbn } = req.params;  
  const  review  = req.body.review

  books[isbn].reviews[username] = review; 
  const reviewedBook = books[isbn];

  return res.status(200).json({message: "Your review has been submitted succesfully.", 
   data: reviewedBook
  });
});   

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const session = req.session.authorization;
  if (!session) {
    return res.status(403).json({ message: "User not logged in" });
  }

  const { username } = session;
  const { isbn } = req.params;

  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!book.reviews[username]) {
    return res.status(404).json({ message: "No review found for user" });
  }

  delete book.reviews[username];

  return res.status(200).json({
    message: "Successfully deleted review",
    data: book
  });
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
