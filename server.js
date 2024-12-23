import express from 'express';
const app = express();
import 'dotenv/config';
import cors from 'cors';
import session from 'express-session';
import pkg from 'connect-pg-simple';
const pgSession = pkg(session);
import methodOverride from 'method-override'
import { pool } from './config/sql.js'
import { engine } from 'express-handlebars';
import authController from './controllers/auth.js';
import booksController from './controllers/books.js';
import viewsController from './controllers/views.js';
import * as authHelpers from './utils/authHelpers.js';
import * as booksHelpers from './utils/booksHelpers.js';
import mongoose from 'mongoose';

const PORT = process.env.PORT ?? 3000

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', './views')

await mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("Connected to Mongo.")
})

app.set('trust proxy', 1)

app.use(session({
    store: new pgSession({
        pool: pool,
        tableName: 'user_sessions',
        createTableIfMissing: true
    }),
    secret: process.env.SECRET,
    saveUninitialized: false,
    resave: false,
    proxy: true,
    cookie: {
        path:'/',
        httpOnly: false,
        secure: false,
        maxAge: 86400000,
        sameSite: 'strict'
    }
}))
app.use(cors({
    origin: ['http://localhost:3000', ],
    methods: ["GET","POST","PUT","DELETE"],
    credentials: true
}))
app.use(methodOverride('_method'))
app.use(express.json())
app.options('*', cors())
app.use('/api/auth', authController)
app.use('/api/books', booksController)  
app.use('/', viewsController)

app.use(express.static('public'))

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`)
})