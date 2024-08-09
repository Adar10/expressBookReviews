const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    const userExists = users.some(user => user.username === username);
    if (userExists) {
        return res.status(401).json({ message: "Username already exists." });
    }

    users.push({ username, password });

    return res.status(201).json({ message: "User registered successfully." });
    
});


// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //Write your code here
  try {
    const getBooks = new Promise((resolve, reject) => {
        resolve(books);
    });

    const bookList = await getBooks;
    res.json(bookList);
} catch (error) {
    res.status(401).json({ message: "Error fetching book list" });
}
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;

        const getBookByIsbn = new Promise((resolve, reject) => {
            if (books[isbn]) {
                resolve(books[isbn]);
            } else {
                reject("Book not found");
            }
        });

        const book = await getBookByIsbn;
        res.send(book);
    } catch (error) {
        res.status(404).send(error);
    }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    try {
        const author = req.params.author;
        const booksLength = Object.keys(books).length;
        
        const getBooksByAuthor = new Promise((resolve, reject) => {
            
            const result = [];
            for(let i = 1; i < booksLength; i++) {
                if(author === books[i].author) {
                    result.push(books[i]);
                    console.log(books[i]);
                }
            }
            
            if (result.length > 0) {
                resolve(result);
            } else {
                reject("No books found for this author");
            }
        });

        const booksByAuthor = await getBooksByAuthor;
        res.send(booksByAuthor);
    } catch (error) {
        res.status(404).send(error);
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    try {
        const title = req.params.title;
        const booksLength = Object.keys(books).length;

        const getBooksByTitle = new Promise((resolve, reject) => {
            const result = [];
            for(let i = 1; i < booksLength; i++) {
                if(title === books[i].title) {
                    result.push(books[i]);
                }
            }
            if (result.length > 0) {
                resolve(result);
            } else {
                reject("No books found with this title");
            }
        });

        const booksByTitle = await getBooksByTitle;
        res.send(booksByTitle);
    } catch (error) {
        res.status(404).send(error);
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  res.send(books[isbn].reviews);

});

module.exports.general = public_users;
