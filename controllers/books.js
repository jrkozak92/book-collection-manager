import express from 'express';
const router = express.Router()
import Books from '../models/books.js';
import * as db from '../config/sql.js';

const isAuthenticated = (req, res, next) => {
//     console.log(`auth type: ${typeof req.session.authenticated}, value: ${req.session.authenticated}`)
//     if (req.session.authenticated){
//         console.log('You are logged in.')
        return next()
//     }   else {
//         console.log('You are not logged in.\nReq.session: ', req.session, '\nAuthenticated: ', req.session.authenticated)
//         res.send(`You're not logged in.`)
//     }
}


router.get('/search', (req, res) => {
    console.log('Getting book search')
    res.send('Getting book search')
})

router.get('/', (req, res) => {
    console.log('Getting Books')
    res.send('Getting Books')   
})

router.post('/', isAuthenticated, (req, res) => {
    const collectionId = db.query(
        ''
    )
    const newBook = {
        title: req.body.title,
        author: req.body.author,
        isbn: req.body.isbn,
        category: req.body.category,
        collection_id: collectionId, // References PostgreSQL user_collections
    }
    Books.create(newBook, (err, newBook) => {

    })
}) 

router.put('/:id', isAuthenticated, (req, res) => {

})

router.delete('/:id', isAuthenticated, (req, res) => {

})

export default router;