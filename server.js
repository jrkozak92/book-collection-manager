import express from 'express';
const app = express();
import 'dotenv/config';
import cors from 'cors';
import session from 'express-session';
import authController from './controllers/auth.js';
import booksController from './controllers/books.js';

const PORT = process.env.PORT ?? 3000



// app.set('trust proxy', true)

// app.use(session({
//     secret: process.env.SECRET,
//     saveUninitialized: false,
//     resave: false,
//     cookie: {
//         path:'/',
//         httpOnly: false,
//         secure: true,
//         maxAge: 86400000,
//         sameSite: 'none'
//     },
//     store: store
// }))

app.use(cors({
    origin: ['http://localhost:3000'],
    methods: ["GET","POST","PUT","DELETE"],
    credentials: true
}))

app.use(express.json())

app.use('/api/auth', authController)
app.use('/api/books', booksController)

app.use(express.static('public'))
app.get('/', (req, res) => {
    res.send('index')
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`)
})