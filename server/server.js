require('dotenv').config();

const express = require('express');
const app = express();
const cookies = require("cookie-parser");
const db = require('./db.js');
const authRoutes = require('./routes/auth.js');

//const { check } = require('express-validator');
const cors = require('cors');

//const port = 8000;

app.use(cors({
    origin: true, 
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookies());

app.use('/routes', authRoutes);


app.get('/', (req, res) => {
    db.query(`SELECT * FROM user`, (err, data) => {
        if (err) return res.status(500).json(err);
        else console.log(data);
    });
    res.send('Hello');
});

app.listen(process.env.PORT, () => {
    console.log(`Port that is listened on ${process.env.PORT}`);
});