import pg from 'pg';
const { Pool } = pg;
import 'dotenv/config';

export const pool = new Pool({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    port: process.env.SQL_DBPORT,
    database: process.env.SQL_DATABASE
});

export const query = async (text, params, callback) => {
    console.log("querying")
    return pool.query(text, params, callback)
};

export const isAuthenticated = async (req, res, next) => {
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