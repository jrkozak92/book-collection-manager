import express from 'express';
const router = express.Router()
import Book from '../models/books.js';
import * as db from '../config/sql.js';
import { data } from './views.js';

const isAuthenticated = (req, res, next) => {
    // console.log(`auth type: ${typeof req.session.authenticated}, value: ${req.session.authenticated}`)
    // if (req.session.authenticated){
    //     console.log('You are logged in.')
        return next()
    // }   else {
    //     console.log('You are not logged in.\nReq.session: ', req.session, '\nAuthenticated: ', req.session.authenticated)
    //     res.send(`You're not logged in.`)
    // }
}


router.get('/search', (req, res) => {
    console.log('Getting book search')
    res.send('Getting book search')
})

router.get('/', (req, res) => {
    console.log('Getting Books')
    res.send('Getting Books')   
})

router.post('/', isAuthenticated, async (req, res) => {
    try {
        const collectionId = 0
        const sqlResponse = await db.query(
            'INSERT INTO user_collections(user_id, name) VALUES ($1, $2);',
            [req.session.user.id, req.params.category]
        )
        console.log("Form data @ create: ", req, sqlResponse)
        const newBook = new Book({
            title: req.params.title,
            author: req.params.author,
            isbn: req.params.isbn,
            category: req.params.category,
            collection_id: collectionId ?? 0, // References PostgreSQL user_collections
        })
        await newBook.save()
        data.books.push(newBook)
        console.log(data.books)
        res.redirect("/")
    } catch (err) {
        console.error("Error creating Book record: ", err)
    }
})

router.put('/:id', isAuthenticated, (req, res) => {

})

router.delete('/:id', isAuthenticated, (req, res) => {

})

export default router;