import express from 'express';
const router = express.Router()
import bcrypt from 'bcrypt';
import * as db from '../config/sql.js';



router.post('/register', async (req, res) => {
    const result = bcrypt.genSalt(10, async function(err, salt) {
        if (err){
            return err
        }
        bcrypt.hash(req.body.password, salt, async function(err, hash){
            const value = await db.query(
                'INSERT INTO users (username, password_hash) VALUES ($1, $2);',
                [req.body.username, hash]
            )
            return value
        })
    })
    res.send('New user created: ', result)
})

router.post('/login', async (req, res) => {
    console.log(req.body.username, req.body.password)
    const result = await db.query(
        'SELECT username, password_hash FROM users WHERE username = $1;',
        [req.body.username]
    )
    const userData = result.rows?.[0]
    console.log(userData)
    if (userData){
        bcrypt.compare(req.body.password, userData.password_hash, 
            function(err, result){
                if (err){
                    return err
                }
                if (result){
                    // initiate sessions
                    res.send('success')
                } else {
                    // return login error message for password mismatch
                    res.send('login failed')
                }
            }
        )
    } else {
        // return login error messsage for username not found
        res.send('login failed')
    }
})

router.delete('/logout', (req, res) => {
    //Destroy session
    req.session.destroy((err)=>{
        if (err) {
            res.send('There was a problem logging out.')
        } else {
            console.log("session destroyed")
            res.send('Logged out.')
        }
    })
})

export default router;

// router.put('/', (req, res) => {
//     Auth.findOne({username: req.body.username}, (err, foundUser)=>{
//         if (err) {
//             console.log('DB error')
//             console.error('User not found')
//             res.send(err)
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
//                         res.send(req.session)
//                     })
//                 })
//             } else {
//                 //passwords don't match, kick the request back
//                 console.log('password fail')
//                 res.send('Login failed')
//             }
//         }
//     })
// })