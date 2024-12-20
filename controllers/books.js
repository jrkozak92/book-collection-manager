import express from 'express';
const router = express.Router()
import Books from '../models/books.js';

router.get('/search', (req, res) => {
    console.log('Getting book search')
    res.send('Getting book search')
})

router.get('/', (req, res) => {
    console.log('Getting Books')
    res.send('Getting Books')   
})

router.post('/', (req, res) => {

}) 

router.put('/:id', (req, res) => {

})

router.delete('/:id', (req, res) => {

})

export default router;