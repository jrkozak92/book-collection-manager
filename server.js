import express from 'express';
const app = express();
import 'dotenv/config';
import cors from 'cors';
import session from 'express-session';
import { engine } from 'express-handlebars';
import authController from './controllers/auth.js';
import booksController from './controllers/books.js';
import * as authHelpers from './utils/authHelpers.js';
import * as booksHelpers from './utils/booksHelpers.js';

const PORT = process.env.PORT ?? 3000

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', './views')

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
    res.render('main', {
        layout: 'index',

        // helpers: {
        //     showLoginPrompt() { authHelpers.showLoginPrompt() },
        //     showRegisterPrompt() { authHelpers.showRegisterPrompt()}
        // }
    })
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`)
})