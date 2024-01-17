const express = require('express');
const db = require('../db.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const gameState = require('../game/gameStateObj.js');
const router = express.Router();

const insertGame = `INSERT INTO game 
(id, user_id, gold, diamonds, currentlevel, maxlevel, currentstage, maxstage, currenthp, maxhp, currentdamage, totaldamage, critchance, guild_id) 
SELECT NULL, MAX(id), '100', '100', '1', '1', '0', '0', '10', '10', '1', '0', '0.01', NULL FROM users`;
const insertItems = `INSERT INTO users_items (id, user_id, item_id, level, cost, damage, locked) 
VALUES (NULL, (SELECT MAX(id) FROM users), '1', '0', '100', '1', '0');
INSERT INTO users_items (id, user_id, item_id, level, cost, damage, locked) 
VALUES (NULL, (SELECT MAX(id) FROM users), '2', '0', '1000', '10', '1');
INSERT INTO users_items (id, user_id, item_id, level, cost, damage, locked) 
VALUES (NULL, (SELECT MAX(id) FROM users), '3', '0', '2500', '100', '1');`;
const maxGameId = `SELECT MAX(id) AS last_id FROM game`;
const registerQuery = `INSERT INTO users VALUES (NULL, ?, ?, ?, '0', '0')`;
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
const fetchNotifications = `SELECT DISTINCT i.id, i.user_id, i.guild_id, g.name FROM invitations i
JOIN guilds g ON i.guild_id = g.id
WHERE i.user_id = ?`;
const deleteNotification = `DELETE FROM invitations WHERE user_id = ? AND guild_id = ?`;

global.userId = null;

process.on('currentUserIdSet', (userId) => {
    console.log(`currentUserIdSet: ${userId}`); //global variable for connected user
});

const checkAuth = (req, res, next) => {
    //console.log('Cookie: ' + req.cookies);
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

let queryAll = `SELECT * FROM users 
JOIN game ON users.id = game.user_id
JOIN users_items ON users.id = users_items.user_id
WHERE users.id = ?`;

const initialFetch = (playerid, res) => {
    db.query(queryAll, playerid, (err, data) => {
        if (err) return res.status(500).json(err);
        //console.log(data[0].login);

        gameState.player.gold = Number(data[0].gold);
        gameState.player.diamonds = Number(data[0].diamonds);
        
        //gameState.player.critChance
        gameState.player.currentDamage = Number(data[0].currentdamage);
        gameState.player.totalDamage = Number(data[0].totaldamage);
        gameState.player.critChance = Number(data[0].critchance);
        console.log(`critChance: ${gameState.player.critChance}`);


        gameState.planet.currentLevel = Number(data[0].currentlevel);
        gameState.planet.maxLevel = Number(data[0].maxlevel);
        gameState.planet.currentStage = data[0].currentstage;
        gameState.planet.maxStage = data[0].maxstage;

        gameState.planet.maxHp = data[0].maxhp;
        gameState.planet.currentHp = gameState.planet.maxHp;
        //set hp onload to prevent the object defaults


        gameState.items.blueLaserGun.level = Number(data[0].level);
        gameState.items.blueLaserGun.cost = Number(data[0].cost);
        gameState.items.blueLaserGun.damage = Number(data[0].damage);
        gameState.items.blueLaserGun.damage = data[0].locked;
        gameState.items.greenLaserGun.level = Number(data[1].level);
        gameState.items.greenLaserGun.cost = Number(data[1].cost);
        gameState.items.greenLaserGun.damage = Number(data[1].damage);
        gameState.items.blueLaserGun.damage = data[1].locked;
        gameState.items.redLaserGun.level = Number(data[2].level);
        gameState.items.redLaserGun.cost = Number(data[2].cost);
        gameState.items.redLaserGun.damage = Number(data[2].damage);
        gameState.items.blueLaserGun.damage = data[2].locked;

        console.log(`initialFetch: maxStage: ${gameState.planet.maxStage}`);
        console.log(`initialFetch: currentStage: ${gameState.planet.currentStage}`);

        return res.json({
            login: data[0].login, admin: data[0].admin,
            gold: data[0].gold,
            diamonds: data[0].diamonds,

            currentdamage: data[0].currentdamage,
            totaldamage: data[0].totaldamage,
            critchance: data[0].critchance,

            currentlevel: data[0].currentlevel,
            maxlevel: data[0].maxlevel,
            currentstage: data[0].currentstage,
            maxstage: data[0].maxstage,

            currenthp: data[0].maxhp,
            maxhp: data[0].maxhp,

            bluelasergun: {
                level: data[0].level,
                cost: data[0].cost,
                damage: data[0].damage,
                locked: data[0].locked,
            },
            greenlasergun: {
                level: data[1].level,
                cost: data[1].cost,
                damage: data[1].damage,
                locked: data[1].locked,
            },
            redlasergun: {
                level: data[2].level,
                cost: data[2].cost,
                damage: data[2].damage,
                locked: data[2].locked,
            },
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

        db.query(`INSERT INTO users VALUES (NULL, ?, ?, ?, '0', '0')`, [email, login, hash], (err, data) => {
            console.log(values);
            if (err) return res.status(500).json(err);
            //else return res.status(201).json('User has been created!');
            console.log(`inside registerQuery`);

            db.query(insertGame, (err, data) => {
                if (err) return res.status(500).json(`gameInsert err: ${err}`);
                //else return res.status(201).json('Game data inserted!');
                console.log(`inside insertGame`);
                
                db.query(insertItems, (err, data) => {
                    console.log(`inside insertItems`);
                    if (err) return res.status(500).json(`gameInsert err: ${err}`);
                    else return res.status(201).json('Game data inserted!');

                });
            });
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

router.get('/guild', checkAuth, (req, res) => {
    db.query(getMessages, (err, data) => {
        if (err) throw err;
        //console.log(data);
        res.send(data);
    });
});

router.post('/guild', checkAuth, (req, res) => {
    console.log(`guild_send userId: ${req.id} ${req.body.input}`);
    db.query(sendMessage, [req.body.input, req.id], (err, data) => {
        if (err) throw err;
        console.log(data);
    });
    db.query('SELECT * FROM messages WHERE message = ? AND user = ?', [req.body.input, req.id], (err, data) => {
        if (err) throw err;
        console.log(`read data from guild insert: ${data[0].user} + reqid ${req.id}`);
        res.send(data);
    });
});

router.get('/notifications', checkAuth, (req, res) => {
    console.log(`notifications_send userId: ${userId}`);
    db.query(fetchNotifications, [req.id], (err, data) => {
        if (err) throw err;
        console.log(data);
        res.send(data);
    });
})

router.post('/notifications', checkAuth, (req, res) => {
    console.log(`notif delete: ${req.id} ${req.body.guild_id}`)
    db.query(deleteNotification, [req.id, req.body.guild_id], (err, data) => {
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
