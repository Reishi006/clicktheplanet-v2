const express = require('express');
const app = express();
const uuid = require('uuid');
const cookie = require('cookie');

const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');

const { checkAuth } = require('../routes/auth.js');
const db = require('../db.js');
const gameState = require('./gameStateObj.js');
const { privateDecrypt } = require('crypto');

process.on('currentUserIdSet', (userId) => {
    console.log(`currentUserIdSet: ${userId}`); //global variable for connected user
});

let advance = true;
let stageCount = 10;
let reset = false;

let isCritical = false;
let crit = 0;

let spin = 0;

let arrowQuery = 'UPDATE game JOIN users ON game.user_id = users.id SET currentlevel = ?, currentstage = ?, currenthp = ?, maxHp = ? WHERE users.id = ?';
let itemQuery = `UPDATE users_items ut
JOIN users u ON ut.user_id = u.id
JOIN game ga ON u.id = ga.user_id
SET ut.level = ?, ut.cost = ?, ut.damage = ?, ga.currentdamage = ?
WHERE u.id = ? AND ut.item_id = ?`;
let diamondsQuery = `UPDATE game JOIN users ON game.user_id = users.id SET diamonds = ? WHERE users.id = ?`;

const calculatePlanet = () => {
    if (gameState.planet.currentLevel == 1) {
        gameState.planet.maxHp = 10;
        gameState.planet.currentHp = gameState.planet.maxHp;
        return;
    }
    gameState.planet.maxHp = (((gameState.planet.currentLevel*2)**2)) - gameState.planet.currentLevel**2;
    gameState.planet.currentHp = gameState.planet.maxHp;
    gameState.planet.goldReward = Math.floor(5 * Math.pow(1.2, gameState.planet.currentLevel - 1));
    stageCount = 10;

    if (gameState.planet.currentLevel % 10 === 0) {
        gameState.planet.maxHp = gameState.planet.maxHp * gameState.planet.bossModifier;
        gameState.planet.currentHp = gameState.planet.maxHp;
        gameState.planet.goldReward = gameState.planet.goldReward * gameState.planet.bossModifier;
        stageCount = 1;
    }
}

const advancePlanet = () => {
    gameState.planet.currentStage = gameState.planet.currentStage + 1;
    gameState.planet.maxStage = gameState.planet.maxStage + 1;
    if (gameState.planet.maxStage > stageCount && gameState.planet.currentStage > stageCount) {
        gameState.planet.maxLevel += 1;
        gameState.planet.currentLevel = gameState.planet.maxLevel;
        calculatePlanet();
        if (stageCount == 1) {
            gameState.planet.currentStage = 1;
            gameState.planet.maxStage = 1;
        } else {
            gameState.planet.currentStage = 0;
            gameState.planet.maxStage = 0;
        }
        
        
        if (gameState.planet.currentLevel >= gameState.planet.maxLevel) gameState.planet.maxLevel = gameState.planet.currentLevel;

        db.query('UPDATE game JOIN users ON game.user_id = users.id SET currentlevel = ?, maxlevel = ?, currentstage = ?, maxstage = ?, currenthp = ?, maxhp = ? WHERE users.id = ?', 
        [
            gameState.planet.currentLevel, 
            gameState.planet.maxLevel, 
            gameState.planet.currentStage, 
            gameState.planet.maxStage, 
            gameState.planet.currentHp, 
            gameState.planet.maxHp, 
            userId
        ], (err, data) => {
            if (err) throw err;
            console.log('%c levels updated', 'color: lightgreen');
        });
    } else {
        db.query('UPDATE game JOIN users ON game.user_id = users.id SET currentstage = ?, maxstage = ? WHERE users.id = ?', 
        [gameState.planet.currentStage, gameState.planet.maxStage, userId], (err, data) => {
            if (err) throw err;
            console.log('%c stage updated', 'color: lightblue');
        });
    }
}

const earnGold = () => {
    gameState.player.gold = gameState.player.gold + gameState.planet.goldReward;
    db.query('UPDATE game JOIN users ON game.user_id = users.id SET gold = ? WHERE users.id = ?', [gameState.player.gold, userId], (err, data) => {
        if (err) throw err;
        console.log('%c gold updated', 'color: yellow');
    });
}

const calculateCritChance = () => {
    let random = Math.random();

    if (random <= gameState.player.critChance) {
        return isCritical = true;
    } else {
        return isCritical = false;
    }
}

const calculateCritDamage = () => {
    let dmg = 5 * gameState.player.currentDamage;
    crit = dmg;
    console.log(`critical! ${dmg}`);
    return dmg;
}

const hitPlanet = () => {
    calculateCritChance();
    if (isCritical == true) {
        gameState.planet.currentHp -= calculateCritDamage();
    } else if (isCritical == false) {
        gameState.planet.currentHp -= gameState.player.currentDamage;   
    }
    if (gameState.planet.currentHp <= 0) {
        calculatePlanet();
        earnGold();
        reset = true;
        if (advance) advancePlanet();
    } else {
        reset = false;
    }
}

const arrowLeft = () => {
        advance = false;
        
        if (gameState.planet.currentLevel > 1) {
            gameState.planet.currentLevel -= 1;
            calculatePlanet();
            gameState.planet.currentStage = stageCount;
            console.log(`arrowGold: ${gameState.planet.goldReward}`);

            db.query(arrowQuery, 
            [gameState.planet.currentLevel, gameState.planet.currentStage, gameState.planet.currentHp, gameState.planet.maxHp, userId], (err, data) => {
                if (err) throw err;
                console.log('%c levels updated', 'color: lightgreen');
            });
        } else if (gameState.planet.currentLevel == 1) {
            calculatePlanet();
            gameState.planet.currentStage = stageCount;
            db.query(arrowQuery, 
            [gameState.planet.currentLevel, gameState.planet.currentStage, gameState.planet.currentHp, gameState.planet.maxHp, userId], (err, data) => {
                if (err) throw err;
                console.log('%c levels updated', 'color: lightgreen');
            });
        }
    
}

const arrowRight = () => {
    advance = false;
    if (gameState.planet.currentLevel < gameState.planet.maxLevel && gameState.planet.currentLevel != gameState.planet.maxLevel) {
        gameState.planet.currentLevel += 1;
        calculatePlanet();
        gameState.planet.currentStage = stageCount;

        if (gameState.planet.currentLevel === gameState.planet.maxLevel) {
            advance = true;
            gameState.planet.currentStage = gameState.planet.maxStage;
            console.log(`arrowRight currentStage: ${gameState.planet.currentStage}`);
        }

        db.query(arrowQuery, 
        [gameState.planet.currentLevel, gameState.planet.currentStage, gameState.planet.currentHp, gameState.planet.maxHp, userId], (err, data) => {
            if (err) throw err;
            //console.log('%c levels updated', 'color: lightgreen');
        });
    } else if (gameState.planet.currentLevel === gameState.planet.maxLevel) {
        advance = true;
        gameState.planet.currentStage = gameState.planet.maxStage;
        console.log(`arrowRight currentStage: ${gameState.planet.currentStage}`);

        db.query(arrowQuery, 
        [gameState.planet.currentLevel, gameState.planet.currentStage, gameState.planet.currentHp, gameState.planet.maxHp, userId], (err, data) => {
            if (err) throw err;
            //console.log('%c levels updated', 'color: lightgreen');
        });
    }
}

const buyItem = (name, id) => {
    if (gameState.player.gold >= gameState['items'][name]['cost']) {
        gameState.player.gold -= gameState['items'][name]['cost'];
        gameState['items'][name]['level'] += 1;
        gameState['items'][name]['cost'] = Math.floor((gameState['items'][name]['baseCost']) * 1.05**(gameState['items'][name]['level']));
        gameState['items'][name]['damage'] = Math.floor(gameState['items'][name]['damage'] + (gameState['items'][name]['baseDamage'] * 1.05**gameState['items'][name]['level']));
        gameState.player.currentDamage += gameState['items'][name]['damage'];
        console.log(gameState['items'][name]);

        db.query(itemQuery, 
        [
            gameState['items'][name]['level'], 
            gameState['items'][name]['cost'], 
            gameState['items'][name]['damage'], 
            gameState.player.currentDamage,
            userId,
            id
        ],
            (err, data) => {
                if (err) throw err;
            });
        }
}

const setDiamonds = () => {
    gameState.player.diamonds += 1;
    db.query(diamondsQuery, [gameState.player.diamonds, userId], (err, data) => {
        if (err) throw err;
    });
}

const getMessage = (mess, uid, socket) => {
    const getLastMessage = `SELECT m.*, u.login
    FROM messages AS m
    JOIN users AS u ON u.id = m.user
    WHERE m.date_sent = (
     SELECT MAX(m2.date_sent)
     FROM messages AS m2
     WHERE m2.guild_id = m.guild_id AND m2.message LIKE ?
    )
    AND u.id = ?`;
 
    db.query(getLastMessage, [mess, uid], (err, data) => {
        if (err) throw err;
        const messageData = data[0];
        console.log('data:', data);
        console.log(`messageData.id ${messageData.id}`);
        console.log(messageData.guild_id);
        socket.join(messageData.guild_id);
        socket.emit('receiveinputsubmit', {
            id: messageData.id,
            login: messageData.login,
            message: messageData.message,
            date_sent: messageData.date_sent
        });
        //console.log(`messageData: ${messageData.login}`);
    });
}

const setAdminGold = (g) => {
    gameState.player.gold = g;

    db.query('UPDATE game JOIN users ON game.user_id = users.id SET gold = ? WHERE users.id = ?', [g, userId], (err, data) => {
        if (err) throw err;
    });
}

const setAdminDiamonds = (d) => {
    gameState.player.diamonds = d;

    db.query('UPDATE game JOIN users ON game.user_id = users.id SET diamonds = ? WHERE users.id = ?', [d, userId], (err, data) => {
        if (err) throw err;
    });
}

const setAdminLevel = (l) => {
    gameState.planet.currentLevel = l;
    if (gameState.planet.maxLevel < gameState.planet.currentLevel) gameState.planet.maxLevel = currentLevel;

    db.query('UPDATE game JOIN users ON game.user_id = users.id SET currentlevel = ?, maxlevel = ? WHERE users.id = ?', 
    [l, gameState.planet.maxLevel, userId], (err, data) => {
        if (err) throw err;
    });
}

const setAdminStage = (s) => {
    if (s > 10 || s < 0) {
        return;
    } else {
        gameState.planet.currentStage = s;
        if (gameState.planet.maxLevel === gameState.planet.currentLevel) gameState.planet.maxStage = gameState.planet.currentStage;
        if (gameState.planet.currentLevel % 10 === 0) {
            stageCount = 1;
        } else {
            stageCount = 10;
        }
    }

    db.query('UPDATE game JOIN users ON game.user_id = users.id SET currentstage = ?, maxstage = ? WHERE users.id = ?', 
    [s, gameState.planet.maxStage, userId], (err, data) => {
        if (err) throw err;
    });
}

const setAdminCrit = (c) => {
    if (c < 1 && c >= 0) gameState.player.critChance = c;
    else return;

    console.log(`c: ${c}`);

    db.query(`UPDATE game JOIN users ON game.user_id = users.id SET critchance = ? WHERE users.id = ?`, 
    [c, userId], (err, data) => {
        if (err) throw err;
    });
}


//let roomId = '';

const getGuild = (uid) => {
    const guildQuery = `SELECT u.id, ga.guild_id 
    FROM users AS u 
    JOIN game AS ga ON u.game_id = ga.id
    WHERE u.id = ?`;

    db.query(guildQuery, [uid], (err, data) => {
        if (err) throw err;
        console.log(data);
        let myData = data[0];
        roomId = myData.guild_id;
    });
}

//console.log(`roomdId: ${roomId}`);

module.exports = {
    getIo: (server) => {
        const io = new Server(server, {
            cors: {
                origin: 'http://localhost:3000',
                methods: ['GET', 'POST'],
                credentials: true,
            }
        });
        io.on("connection", (socket) => {
            console.log(`Socket from gameState: ${socket.id}`);

            console.log(`userId socket: ${typeof userId} ${userId}`);

            //const roomId = '';/* uuid.v4(); */ // Generate a unique ID
            /* socket.join(roomId); // Assign the player to a unique room
            console.log(roomId);
            getGuild(userId); */
            
            //socket.to(roomId).emit('receive_setall', gameState);
            

            /* socket.on('openchat', () => {
                let guildId = 0;
                db.query(`SELECT ga.guild_id FROM game ga 
                JOIN guilds g ON ga.guild_id = g.id 
                JOIN users u ON u.game_id = ga.id
                WHERE u.id = ?`
                , [userId], (err, data) => {
                    guildId = data[0].guild_id;
                    console.log(`guildId: ${guildId}`);
                    socket.join(guildId);
                    
                    socket.to(guildId).emit('receivechat', {currentHp: gameState.planet.currentHp});
                });
            }) */

            socket.on('sendclick', () => {
                hitPlanet();
                socket.emit('receiveclick', {gameState: gameState, reset: reset, isCritical: isCritical, crit: crit});
            });

            socket.on('arrowleft', () => {
                console.log('arrowleft currentLevel: ' + gameState.planet.currentLevel);
                console.log('arrowleft maxHp: ' + gameState.planet.maxHp);
                arrowLeft();
                socket.emit('receivearrowleft', {gameState: gameState});
                console.log('arrowleft maxLevel: ' + gameState.planet.maxLevel);
                
                console.log('arrowleft currentLevel after emit: ' + gameState.planet.currentLevel);
                console.log('arrowleft maxHp after emit: ' + gameState.planet.maxHp);
            });

            socket.on('arrowright', () => {
                arrowRight();
                console.log('arrowright');
                //console.log(gameState.planet.currentHp);
                console.log('arrowright currentLevel: ' + gameState.planet.currentLevel);
                console.log('arrowright maxLevel: ' + gameState.planet.maxLevel);
                socket.emit('receivearrowright', {gameState: gameState});
            });

            socket.on('buyitem', (data) => {
                console.log(`buyitem data: ${data.id}`);

                buyItem(data.name, data.id);

                socket.emit('receivebuyitem', {gameState: gameState, name: data.name});
            });

            socket.on('spin', () => {
                spin =  Math.floor(Math.random()*360*10);

                socket.emit('receivespin', {spin: spin});
            });

            socket.on('diamonds', () => {
                setDiamonds();
                socket.emit('receivediamonds', {gameState: gameState});
                console.log(`diamonds sent`);
            })

            socket.on('inputsubmit', (data) => {
                /* ===== TO BE FIXED ===== */
                console.log(`input: ${data.input} ${data.id}`);
                
                getMessage(data.input, data.id, socket);
                
                //socket.emit('receiveinputsubmit', );
                
            });

            //ADMIN PANEL

            socket.on('setgold', (gold) => {
                setAdminGold(gold);
                socket.emit('receivesetgold', {gameState: gameState});
            });

            socket.on('setdiamonds', (diamonds) => {
                setAdminDiamonds(diamonds);
                socket.emit('receivesetdiamonds', {gameState: gameState});
            });

            socket.on('setlevel', (level) => {
                setAdminLevel(level);
                socket.emit('receivesetlevel', {gameState: gameState});
            });

            socket.on('setstage', (stage) => {
                setAdminStage(stage);
                socket.emit('receivesetstage', {gameState: gameState});
            });

            socket.on('setcrit', (crit) => {
                setAdminCrit(crit);
                socket.emit('receivesetcrit', {gameState: gameState});
            });
        });

        return io;
    }
}
