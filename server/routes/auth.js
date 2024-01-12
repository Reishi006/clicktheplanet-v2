const express = require('express');
const { Server } = require('socket.io')
const db = require('../db.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const gameState = require('../game/gameStateObj.js');

const router = express.Router();

const registerQuery = `INSERT INTO users (email, login, password) VALUES (?)`;
const loginQuery = `SELECT * FROM users WHERE login = ?`;
const checkUser = `SELECT * FROM users WHERE email = ? OR login = ?`;
const getMessages = `SELECT DISTINCT m.id, m.user, m.message, m.date_sent, m.guild_id, u.login 
FROM messages AS m 
JOIN users AS u ON u.id = m.user 
JOIN guilds ON guilds.id = m.guild_id 
JOIN game ON game.guild_id = guilds.id;`;
const sendMessage = `INSERT INTO messages (id, user, message, date_sent, guild_id)
SELECT NULL, u.id, ?, CURRENT_TIMESTAMP, gd.id
FROM users u
JOIN game g ON u.game_id = g.id
JOIN guilds gd ON g.guild_id = gd.id
WHERE u.id = ?`;

global.userId = null;

process.on('currentUserIdSet', (userId) => {
    console.log(`currentUserIdSet: ${userId}`); //global variable for connected user
});

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

/* const checkAdmin = (req, res, next) => {
    db.query('SELECT admin FROM users WHERE id = ?', req.id, (err, data) => {
        if (err) return res.status(500).json(err);
        if (data[0].admin === 0) return res.sendStatus(403);
        else if (data[0].admin === 1) console.log(`${req.id} is an Admin!`);
        return data[0].admin;
    });
    next();
} */

let queryAll = 'SELECT * FROM users JOIN game ON game.id = users.game_id JOIN guilds ON guilds.id = game.guild_id WHERE users.id = ?';

const initialFetch = (playerid, res) => {
    db.query(queryAll/* 'SELECT * FROM game JOIN users ON game.id = users.game_id WHERE users.id = ?' */, playerid, (err, data) => {
        if (err) return res.status(500).json(err);
        //console.log(data[0].login);

        gameState.player.gold = Number(data[0].gold);
        gameState.player.diamonds = Number(data[0].diamonds);
        //gameState.player.currentDamage = 
        //gameState.player.critChance
        gameState.player.totalDamage = Number(data[0].totaldamage);


        gameState.planet.currentLevel = Number(data[0].currentlevel);
        gameState.planet.maxLevel = Number(data[0].maxlevel);
        gameState.planet.currentStage = data[0].currentstage;
        gameState.planet.maxStage = data[0].maxstage;

        if (gameState.planet.currentLevel == 1) {
            gameState.planet.maxHp = 10;
            gameState.planet.currentHp = gameState.planet.maxHp;
        } else {
            gameState.planet.maxHp = (((gameState.planet.currentLevel*2)**2)) - gameState.planet.currentLevel**2;
            gameState.planet.currentHp = gameState.planet.maxHp;
        } //set hp onload to prevent the object defaults


        console.log(`initialFetch: maxStage: ${gameState.planet.maxStage}`);
        console.log(`initialFetch: currentStage: ${gameState.planet.currentStage}`);

        return res.json({
            login: data[0].login, admin: data[0].admin,
            gold: data[0].gold,
            diamonds: data[0].diamonds,

            totaldamage: data[0].totaldamage,

            currentlevel: data[0].currentlevel,
            maxlevel: data[0].maxlevel,
            currentstage: data[0].currentstage,
            maxstage: data[0].maxstage,

            currenthp: gameState.planet.currentHp,
            maxhp: gameState.planet.maxHp,
        });
    });
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

    global.userId = req.id;
    console.log(`global.userId ${typeof global.userId}`);
    process.emit('currentUserIdSet', global.userId);

    initialFetch(req.id, res);
    /* db.query(queryAll, (err, data) => {
        console.log(data);
    }); */


    //SET GAME STATE
    /* db.query('SELECT * FROM game JOIN users ON game.id = users.game_id WHERE users.id = ?', req.id, (err, data) => {
        console.log(data[0].gold);
        gameState.player.gold = data[0].gold;
        console.log(`gameState.player.gold  ${gameState.player.gold }`);
        res.json({gold: data[0].gold});
    }); */
});

router.get('/mainadmin', checkAuth, /* checkAdmin, */ (req, res) => {
    console.log(`mainadmin req.id: ${req.id}`);

    /* db.query('SELECT * FROM users WHERE id = ?', req.id, (err, data) => {
        if (err) return res.status(500).json(err);
        //console.log(data[0].login);
        return res.json({login: data[0].login});
    }); */

    /* db.query('SELECT * FROM users WHERE id = ?', req.id, (err, data) => {
        if (err) return res.status(500).json(err);
        console.log(data[0].login);
        return res.json({login: data[0].login, admin: data[0].admin});
    }); */

    initialFetch(req.id, res);
})

router.get('/guild', (req, res) => {
    db.query(getMessages, (err, data) => {
        if (err) throw err;
        console.log(data);
        res.send(data);
    });
});

router.post('/guild', (req, res) => {
    console.log(`guild_send userId: ${userId} ${req.body.input}`);
    db.query(sendMessage, [req.body.input, userId], (err, data) => {
        if (err) throw err;
        console.log(data);
        res.send(data);
    });
});


router.post('/logout', (req, res) => {
    res.clearCookie("access_token",{
        sameSite:"none",
        secure:true
    }).sendStatus(200);
});

module.exports = router;