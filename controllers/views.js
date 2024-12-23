import express from 'express';
const router = express.Router()

export const data = {
    layout: 'index',
    collections: ['all'],
    books: [
        {
            title: 'Dune',
            author: "IDK",
            isbn: 1234,
            collection: "fiction"
        }
    ],
    user: {}
}

export const setData = () => {

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
            layout: 'index',
            loggedIn: true,
            showAddForm: true
        }
    )
})

router.get('/', async (req, res) => {
    console.log('Data before being rendered: ', data)
    res.render('main', {
        ...data
    })
})

export default router;