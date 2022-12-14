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
    const { loggedIn } = req.cookies;
    if (loggedIn !== 'true') user.loggedIn = false;

    console.log('Cookie: ', typeof loggedIn);

    if (user.loggedIn === true) {
        console.log('true');
        res.sendFile(path.join(__dirname, '/views/user.html'));
    } else if (user.loggedIn === false) {
        console.log('False');
        res.sendFile(path.join(__dirname, '/views/index.html'));
    }
});

app.get('/user', (req, res) => {
    const { loggedIn } = req.cookies;

    if (loggedIn !== 'true') user.loggedIn = false;

    console.log(req.cookies);

    if (user.loggedIn === true) {
        console.log('Cookie: ', req.cookies);
        res.sendFile(path.join(__dirname, '/views/user.html'));
    } else if (user.loggedIn === false) {
        console.log('User false');
        res.redirect('/');
    }
});

app.post('/', (req, res) => {
    console.log(req.body);
    user.loggedIn = false;
    res.cookie('loggedIn', user.loggedIn, { maxAge: 6000000000, httpOnly: true, secure: false });
    res.redirect('/');
});

app.post('/user', (req, res) => {
    const { username, password } = req.body;
    if (username === user.username && password === user.password) {
        console.log(req.body);
        user.loggedIn = true;
        res.cookie('loggedIn', user.loggedIn, { maxAge: 6000000000, httpOnly: true, secure: false });
        res.redirect('/user');
    } else {
        console.log('Wrong username or password');
        console.log(req.body);
        res.redirect('/');
    }
});

app.listen(port, () => {
    console.log("Server started on port", port);
});