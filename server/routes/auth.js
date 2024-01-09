const express = require('express');
const { Server } = require('socket.io')
const db = require('../db.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

const registerQuery = `INSERT INTO users (email, login, password) VALUES (?)`;
const loginQuery = `SELECT * FROM users WHERE login = ?`;
const checkUser = `SELECT * FROM users WHERE email = ? OR login = ?`;


const checkAuth = (req, res, next) => {
    console.log('Cookie: ' + req.cookies);
    const token = req.cookies.access_token;

    console.log(`token i access: ${token} ${process.env.ACCESS_TOKEN_SECRET}`);

    if (token == null || !token) {
        //return res.redirect('login');
        return res.sendStatus(401);
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);//console.log(`${err.name} ${err.message}`);
        db.query('SELECT * FROM users WHERE login = ?', user.id, (err, data) => {
            if (err) return res.status(500).json(err);
            console.log('losowe from query' + user.id);
            return (user.id);
        });
        req.id = user.id;
        next();
    });
    
}

const checkAdmin = (req, res, next) => {
    db.query('SELECT admin FROM users WHERE id = ?', req.id, (err, data) => {
        //if (err) return res.status(500).json(err);
        if (data[0].admin === 0) return res.sendStatus(403);
        else if (data[0].admin === 1) console.log(`${req.id} is an Admin!`);
        return data[0].admin;
    });
    next();
}


const registerHandler = async (req, res) => {
    const { email, login, password } =  await req.body;
    db.query(checkUser, [email, login], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length) return res.status(409).json("User already exists!");

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const values = [email, login, hash];

        db.query(registerQuery, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            else return res.status(201).json('User has been created!');
        });
        console.log(`From React: ${values}`);
    });
}

router.post('/register', registerHandler);



const loginHandler = async (req, res) => {
    const { login, password } =  await req.body;

    db.query(loginQuery, login, (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json(err);

        console.log(`${data[0].password} and ${password}`);

        const isPasswordCorrect = bcrypt.compareSync(
            password,
            data[0].password
        );

        console.log(isPasswordCorrect);

        if (isPasswordCorrect != true) return res.status(400).json("Wrong username or password!");


        const token = jwt.sign({ id: data[0].id }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 8*60*60});

        res
        .cookie("access_token", token, {
            httpOnly: true,
        })
        .status(200)
        .json(token);

        /* const user = {name: login};

        const accessToken = generateAccessToken(user);
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
        refreshTokens.push(refreshToken);
        res.json({ accessToken: accessToken, refreshToken: refreshToken }); */
    });
    console.log(`From React: ${login} ${password}`);
}

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '10s'});
}

router.post('/login', loginHandler);


router.get('/main', checkAuth, (req, res) => {
    console.log(`req.id: ${req.id}`);

    db.query('SELECT * FROM users WHERE id = ?', req.id, (err, data) => {
        if (err) return res.status(500).json(err);
        console.log(data[0].login);
        return res.json({login: data[0].login, admin: data[0].admin});
    });
});

router.get('/mainadmin', checkAuth, checkAdmin, (req, res) => {
    console.log(`mainadmin req.id: ${req.id}`);

    db.query('SELECT * FROM users WHERE id = ?', req.id, (err, data) => {
        if (err) return res.status(500).json(err);
        console.log(data[0].login);
        return res.json({login: data[0].login});
    });
})


router.post('/logout', (req, res) => {
    res.clearCookie("access_token",{
        sameSite:"none",
        secure:true
    }).sendStatus(200);
});

module.exports = router;
