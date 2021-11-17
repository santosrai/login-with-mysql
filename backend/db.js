import mysql from 'mysql';

export const connection = mysql.createConnection({
    host: 'localhost',
    user: 'newuser',
    password: 'password',
    database: 'login_db'
});

