import express from 'express';
const router = express.Router()
import Book from '../models/books.js';
import * as db from '../config/sql.js';
import { data } from './views.js';


router.get('/search', async (req, res) => {
    console.log('searching for ', req.query.value, req.query.collection)
    let bookList = undefined
    const collection = req.query.collection[0] ?? ""
    if (collection !== ""){
        bookList = data.books.filter((book) => {
                return book.collection_id == collection
            })
    } else {
        bookList = data.books
    }
    const searchResults = {
        isbn: [],
        title: [],
        author: []
    }
    bookList.forEach((book) => {
        if (book.isbn.includes(req.query.value)){
            searchResults.isbn.push(book)
        }
        if (book.title.includes(req.query.value)){
            searchResults.title.push(book)
        }
        if (book.author.includes(req.query.value)){
            searchResults.author.push(book)
        }
    })
    console.log("results: ", searchResults)
    res.status(200).send({ results: searchResults})
})

router.get('/collections', async (req, res) => {
    if (data.user.id){
        const sqlResponse = await db.query(
            'SELECT * FROM user_collections WHERE user_id = $1;',
            [data.user.id]
        )
        console.log('collections @ getCollection: ', sqlResponse.rows)
        data.collections = sqlResponse
            ?   sqlResponse.rows.map((collection) => {
                return {
                    id: collection.id,
                    name: collection.name
                }
            })
            : []
        res.status(200).send(data.collections)
    } else {
        return []
    }
})

router.get('/', async (req, res) => {
    console.log('Getting Books')
    if (data.collections?.length){
        const userCollectionIds = data.collections.map((collection) => {
            return collection.id
        })
        const books = await Book.find({ collection_id: { $in: userCollectionIds }}).lean()
        data.books = books ?? []
        res.status(200).send(data.books)
    } else {
        res.status(200).send([])
    }
})

router.post('/collections', db.isAuthenticated, async (req, res) => {
    try {
        const sqlResponse = await db.query(
            'INSERT INTO user_collections(user_id, name) VALUES ($1, $2) RETURNING *;',
            [req.session.user.id, req.body.name]
        )
        console.log(sqlResponse.rows)
        data.collections = [...sqlResponse.rows]
        res.redirect('/')
    } catch (err) {
        console.error(err)
    }
})

router.post('/', db.isAuthenticated, async (req, res) => {
    console.log("req stuff @ book create: ", req.body)
    try {
        const newBook = new Book({
            title: req.body.title,
            author: req.body.author,
            isbn: req.body.isbn,
            category: req.body.category,
            collection_id: req.body.collection.split('.')[0], // References PostgreSQL user_collections
        })
        await newBook.save()
        data.books.push(newBook)
        data.showAddForm = false
        console.log(data.books)
        res.redirect("/")
    } catch (err) {
        console.error("Error creating Book record: ", err)
    }
})

router.put('/:id', db.isAuthenticated, async (req, res) => {
    try {
        console.log("body pre-update: ", req.body)
        const response = await Book.findByIdAndUpdate(req.params.id, req.body)
        console.log("Response @ Book update: ", response)
        const newBooks = data.books.map((book) => {
            if (book._id === req.params.id) {
                book = response
                book.showEditForm = false
                return book
            }
        })
        data.books = newBooks
        res.redirect("/")
    } catch (err) {
        res.status(500).send({message: 'server error'})
    }
})

router.delete('/:id', db.isAuthenticated, async (req, res) => {
    try {
        const response = await Book.findByIdAndDelete(req.params.id)
        console.log("Response @ Book update: ", response)
        const newBooks = data.books.map((book) => {
            if (book.id === req.params.id) {
                book = response
                book.showEditForm = false
                return book
            }
        })
        data.books = newBooks
        res.redirect("/")
    } catch (err) {
        res.status(500).send({message: 'server error'})
    }
})

export default router;