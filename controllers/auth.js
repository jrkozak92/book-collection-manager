import express from 'express';
const router = express.Router()
import bcrypt from 'bcrypt';
import pg from 'pg';


router.post('/register', (req, res) => {
    res.send('hitting register auth')
})

router.post('/login', (req, res) => {
    res.send('hitting login auth')
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

// const isAuthenticated = (req, res, next) => {
//     console.log(`auth type: ${typeof req.session.authenticated}, value: ${req.session.authenticated}`)
//     if (req.session.authenticated){
//         console.log('You are logged in.')
//         return next()
//     }   else {
//         console.log('You are not logged in.\nReq.session: ', req.session, '\nAuthenticated: ', req.session.authenticated)
//         res.send(`You're not logged in.`)
//     }
// }

// router.get('/', isAuthenticated, (req, res) => {
//     console.log('Auth Check, is authenticated?: ', req.session.authenticated)
//     res.send(req.session)
// })

// router.delete('/', (req, res) => {
//     //Destroy session and notify React
//     req.session.destroy((err)=>{
//         if (err) {
//             res.send('There was a problem logging out.')
//         } else {
//             console.log("session destroyed")
//             res.send('Logged out.')
//         }
//     })
    
// })