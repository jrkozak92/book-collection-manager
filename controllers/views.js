import express from 'express';
const router = express.Router()
import * as db from '../config/sql.js';
import Book from '../models/books.js';

export const data = {
    layout: 'index',
    collections: [],
    books: [],
    user: {}
}

const getCollections = async () => {
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
    } else {
        return []
    }
} 

const getBooks = async () => {
    if (data.collections?.length){
        const userCollectionIds = data.collections.map((collection) => {
            return collection.id
        })
        const books = await Book.find({ collection_id: { $in: userCollectionIds }}).lean()
        data.books = books ?? []
    } else {
        return []
    }
}

const getData = async () => {
    await getCollections()
    await getBooks()
}

router.get('/login', (req, res) => {
    res.render('main', 
    {
        layout: 'index'
    })
})

router.get('/add-book', (req, res) => {
    res.render('main',
        {
            ...data,
            showAddForm: true
        }
    )
})

router.get('/edit-book/:isbn', (req, res) => {
    const newBooks = data.books.map((book) => {
        if (book.isbn === req.params.isbn){
            book.showEditForm = true
            return book
        }
    })
    res.render('main',
        {
            ...data,
            books: newBooks
        }
    )
})

router.get('/', async (req, res) => {
    await getData()
    console.log('Data before being rendered: ', data)
    res.render('main', {
        ...data
    })
})

export default router;