import pg from 'pg';
const { Pool } = pg;
import 'dotenv/config';

const pool = new Pool({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    port: process.env.SQL_DBPORT,
    database: process.env.SQL_DATABASE
});

export const query = async (text, params, callback) => {
    console.log("querying")
    return pool.query(text, params, callback)
};