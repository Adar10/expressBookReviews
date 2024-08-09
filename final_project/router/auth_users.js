const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    { username: "Ad", password: "123" },
  ];

const isValid = (username)=>{ //returns boolean
    for (let i = 0; i < users.length; i++) {
        if (users[i].username === username) {
            return true;
        }
    }
    return false; 
}

const authenticatedUser = (username,password)=>{ //returns boolean
    for (let i = 0; i < users.length; i++) {
        if (users[i].username === username && users[i].password === password) {
            return true;
        }
    }
    return false; 
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }
  
    if (!authenticatedUser(username, password)) {
      return res.status(401).json({ message: "Invalid username or password." });
    }
  
    const token = jwt.sign({ username }, 'access', { expiresIn: 60 * 60 });
    return res.status(200).json({ message: "Login successful" });
  });
  
// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.query;

    const book = books[isbn];
    if (!book) {
        return res.status(404).json({ message: "Book not found." });
    }
    
    
    if (rew) {
        
        book.reviews[0].review = review;
    } else {
        // Add new review
        book.reviews.push({ username, review });
    }

    return res.status(200).json({ message: "Review added/updated successfully", book });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const token = req.headers['Authorization'].split(' ')[1];

    jwt.verify(token, 'access', (err, user) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const username = user.username;
        const book = books[isbn];

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (!book.reviews[username]) {
            return res.status(404).json({ message: "Review not found" });
        }

        delete book.reviews[username];
        res.json({ message: "Review deleted successfully", book });
    });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
