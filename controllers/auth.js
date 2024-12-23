import express from 'express';
const router = express.Router()
import bcrypt from 'bcrypt';
import * as db from '../config/sql.js';
import { data } from './views.js'


router.post('/register', async (req, res) => {
    bcrypt.genSalt(10, async function(err, salt) {
        if (err){
            return err
        }
        bcrypt.hash(req.body.password, salt, async function(err, hash){
            try {
                await db.query(
                    'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING *;',
                    [req.body.username, hash]
                ).then((response) => {
                    if (response){
                        console.log("register response data: ", response)
                        data.user.id = response.rows[0].id
                        console.log("Value after db create", response)
                        // initiate sessions
                        req.session.regenerate((err)=>{
                            if (err){
                                throw err
                            } 
                            req.session.user = {
                                username: req.body.username,
                                id: data.user.id
                            }
                            console.log('authorized: ', req.session.user.username)
                            req.session.save((err)=>{
                                if (err){
                                    console.error(err)
                                }
                                console.log('sesson after saving: ', req.session)
                                console.log('authorized: ', req.session)
                                data.user = {username: req.body.username, id: data.user.id}
                                res.status(201).send({message: "Success"})
                            })
                        })
                    } else {
                        // return login error message for password mismatch
                        res.status(200).send({message: "Failure"})
                    }
                    
                })
            } catch (err) {
                res.status(401).send({message: 'Username taken'})
            }
        })
    })
})

router.post('/login', async (req, res) => {
    console.log(req.body.username, req.body.password)
    const response = await db.query(
        'SELECT * FROM users WHERE username = $1;',
        [req.body.username]
    )
    console.log("Db response: ", response.rows)
    const userData = response.rows?.[0]
    console.log(userData)
    try {
        if (userData){
            bcrypt.compare(req.body.password, userData.password_hash, 
                function(err, response){
                    if (err){
                        res.status(500).send(err)
                    }
                    if (response){
                        // initiate sessions
                        req.session.regenerate((err)=>{
                            if (err){
                                throw err
                            } 
                            req.session.user = {
                                username: userData.username,
                                id: userData.id
                            }
                            console.log('authorized: ', req.session.user.username)
                            req.session.save((err)=>{
                                if (err){
                                    console.error(err)
                                }
                                console.log('sesson after saving: ', req.session)
                                console.log('authorized: ', req.session)
                                data.user = {username: userData.username, id: userData.id}
                                res.status(200).send(req.session)
                            })
                        })
                    } else {
                        // return login error message for password mismatch
                        res.status(200).send({message: "Failure"})
                    }
                }
            )
        } 
    } catch (err) {
        // return login error messsage for username not found
        res.status(404).send({message: 'login error'})
    }
})

const isAuthenticated = async (req, res, next) => {
    try {
        console.log("session @ auth check: ", req.session)
        // console.log(`auth type: ${typeof req.session.authenticated}, value: ${req.session.authenticated}, session: ${req.session.sess}`)
        if (req.session.user?.username){
            console.log('You are logged in.')
            return next()
        } else {
            console.log('You are not logged in.\nReq.session: ', req.session, '\nUser: ', req.session?.user)
            res.status(401).send({message: "Auth failure"})
        }
    } catch (err) {
        console.error(err)
    }
}

router.delete('/logout', isAuthenticated, (req, res) => {
    // Destroy session
    console.log('session data pre-destroy: ', req.session)
    req.session.destroy((err)=>{
        if (err) {
            res.status(500).send({message: 'There was a problem logging out.'})
        } else {
            console.log("session destroyed, logged out.")
            console.log('should be nothing: ', req.session)
            data.user = {}
            res.status(200).send({
                message: "Success"
            })
        }
    })
    
})

export default router;

// router.put('/', (req, res) => {
//     Auth.findOne({username: req.body.username}, (err, foundUser)=>{
//         if (err) {
//             console.log('DB error')
//             console.error('User not found')
//             res.status(200).send(err)
//         } else if (!foundUser){
//             console.log('Username not found: ', foundUser)
//         } else {
//             console.log('Username Found: ', foundUser)
//             console.log('Compare Passwords: ')
//             //check hashed password against db password
//             if (bcrypt.compareSync(req.body.password, foundUser.password)){
//                 //if true, passwords match, send response, set session
//                 console.log('password success')
//                 req.session.regenerate((err)=>{
//                     if (err) return next(err)
//                     req.session.authenticated = true
//                     console.log('authorized: ', req.session.authenticated)
//                     req.session.save((err)=>{
//                         if (err) return next(err)
//                         console.log(req.session)
//                         console.log('authorized: ', req.session.authenticated)
//                         res.status(200).send(req.session)
//                     })
//                 })
//             } else {
//                 //passwords don't match, kick the request back
//                 console.log('password fail')
//                 res.status(200).send('Login failed')
//             }
//         }
//     })
// })