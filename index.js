import express from 'express';
import mysql from 'mysql';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as path from 'path'
import { connection } from './backend/db.js'
import session from 'express-session';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// urlencode: Returns middleware that only parses urlencoded bodies and only looks at requests where the Content-Type header matches the type option
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//get
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/frontend/index.html'));
}
);

app.post('/login', function (req, res) {
    let userName = req.body.username;
    let password = req.body.password;
    console.log(userName, password)
    if (userName && password) {
        connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [userName, password], (err, result) => {
            if (err) throw err;
            if (result.length > 0) {
                // res.send(result)
                req.session.loggedin = true;
                req.session.username = userName;
                res.redirect('/home');
            } else {
                res.send('Invalid UserName or Password')
            }
        }
        )
    } else {
        res.send('Please enter UserName and Password')

    }
});

app.get('/home', function (req, res) {
    if (req.session.loggedin) {
        res.send('Welcome back, ' + req.session.username + '!');
    } else {
        res.send('Please login to view this page!');
    }
    res.end();
})


//listen
app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
}
);
