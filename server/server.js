require('dotenv').config();

const express = require('express');
const sessionStorage = require('sessionstorage');
const app = express();
const http = require('http');
const { Server } = require('socket.io')
const { authorize } = require('socketio-jwt');
const jwt = ('jsonwebtoken');
const cookie = require('cookie');
const cookies = require("cookie-parser");
const cookieParser = require('socket.io-cookie-parser');
const db = require('./db.js');
const authRoutes = require('./routes/auth.js');

//const { check } = require('express-validator');
const cors = require('cors');

const server = http.createServer(app);

const io = new Server(server, {
    cookie: {
        name: 'access_token',
        httpOnly: true,
    },
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
    }
});

io.use(cookieParser())

app.use(cors({
    origin: true, 
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookies());

app.use('/routes', authRoutes);


app.get('/', (req, res) => {
    db.query(`SELECT * FROM users`, (err, data) => {
        if (err) return res.status(500).json(err);
        else console.log(data);
    });
    res.send('Hello');
});

/* io.on('connection', (socket) => {
    console.log('A user has connected ' + socket.id);
});

io.on('message', (socket) => {
    console.log(socket.request.cookies['access_token']);
}) */

server.listen(process.env.PORT, () => {
    console.log(`Port that is listened on ${process.env.PORT}`);
});