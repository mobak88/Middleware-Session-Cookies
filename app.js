const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 8080;

const user = {
    username: 'Test',
    password: 'test123',
    loggedIn: false
};

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.use(cookieParser());

app.use(session({
    secret: 'asdkjadflkdalk',
    resave: true,
    saveUninitialized: true
}));

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    const loggedIn = req.cookies.loggedIn;
    console.log('Cookie: ', typeof loggedIn);
    if (loggedIn === 'true') {
        console.log('true');
        res.sendFile(path.join(__dirname, '/views/user.html'));
    } else {
        console.log('False');
        res.sendFile(path.join(__dirname, '/views/index.html'));
    }
});

app.get('/user', (req, res) => {
    const loggedIn = req.cookies;
    console.log(req.cookies);
    if (loggedIn === true) {
        console.log('Cookie: ', req.cookies);
        res.sendFile(path.join(__dirname, '/views/user.html'));
    } else {
        console.log('User false');
        res.redirect('/');
    }
});

app.post('/user', (req, res) => {
    const { username, password } = req.body;
    if (username === user.username && password === user.password) {
        console.log(req.body);
        user.loggedIn = true;
        res.cookie('loggedIn', user.loggedIn, { maxAge: 6000000000, httpOnly: true, secure: false });
        res.sendFile(path.join(__dirname, '/views/user.html'));
    } else {
        console.log('Wrong username or password');
        console.log(req.body);
        res.sendFile(path.join(__dirname, '/views/index.html'));
    }
});

app.listen(port, () => {
    console.log("Server started on port", port);
});