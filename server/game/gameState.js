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

const { player, planet, items, ship } = gameState;

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
let shipQuery = `UPDATE users_ship us
JOIN users u ON us.user_id = u.id
JOIN game ga ON u.id = ga.user_id
SET us.level = ?, us.cost = ?, us.multiplier = ?, ga.currentdamage = ?
WHERE u.id = ? AND us.ship_id = ?`;
let diamondsQuery = `UPDATE game JOIN users ON game.user_id = users.id SET diamonds = ? WHERE users.id = ?`;

const calculatePlanet = () => {

    clearInterval(interval);
    interval = setInterval(() => {
        dpsPlanet();
    }, 1000);

    if (planet.currentLevel == 1) {
        planet.maxHp = 10;
        planet.currentHp = planet.maxHp;
        return;
    }
    planet.maxHp = (((planet.currentLevel*2)**2)) - planet.currentLevel**2;
    planet.currentHp = planet.maxHp;
    planet.goldReward = Math.ceil((planet.maxHp / 10 ** (planet.currentLevel**0.05)) * ship.gold.multiplier);
    stageCount = 10;

    if (planet.currentLevel % 10 === 0) {
        planet.maxHp = planet.maxHp * planet.bossModifier;
        planet.currentHp = planet.maxHp;
        planet.goldReward = planet.goldReward * planet.bossModifier;
        stageCount = 1;
    }
}

const advancePlanet = () => {
    planet.currentStage = planet.currentStage + 1;
    planet.maxStage = planet.maxStage + 1;
    if (planet.maxStage > stageCount && planet.currentStage > stageCount) {
        planet.maxLevel += 1;
        planet.currentLevel = planet.maxLevel;
        calculatePlanet();
        if (stageCount == 1) {
            planet.currentStage = 1;
            planet.maxStage = 1;
        } else {
            planet.currentStage = 0;
            planet.maxStage = 0;
        }
        
        
        if (planet.currentLevel >= planet.maxLevel) planet.maxLevel = planet.currentLevel;

        db.query('UPDATE game JOIN users ON game.user_id = users.id SET currentlevel = ?, maxlevel = ?, currentstage = ?, maxstage = ?, currenthp = ?, maxhp = ?, totaldamage = ? WHERE users.id = ?', 
        [
            planet.currentLevel, 
            planet.maxLevel, 
            planet.currentStage, 
            planet.maxStage, 
            planet.currentHp, 
            planet.maxHp,
            player.totalDamage,
            userId
        ], (err, data) => {
            if (err) throw err;
            console.log('%c levels updated', 'color: lightgreen');
        });
    } else {
        db.query('UPDATE game JOIN users ON game.user_id = users.id SET currentstage = ?, maxstage = ?, totaldamage = ? WHERE users.id = ?', 
        [planet.currentStage, planet.maxStage, player.totalDamage, userId], (err, data) => {
            if (err) throw err;
            console.log('%c stage updated', 'color: lightblue');
        });
    }
}

const earnGold = () => {
    player.gold = player.gold + planet.goldReward;
    db.query('UPDATE game JOIN users ON game.user_id = users.id SET gold = ? WHERE users.id = ?', [player.gold, userId], (err, data) => {
        if (err) throw err;
        console.log('%c gold updated', 'color: yellow');
    });
}

const calculateCurrentDamage = () => {
    player.currentDamage = Math.ceil(
        (
            1 +
            items.blueLaserGun.damage +
            items.greenLaserGun.damage +
            items.redLaserGun.damage
        ) *
        ship.damageDealt.multiplier
    );
    console.log(items.blueLaserGun.damage +
        items.greenLaserGun.damage +
        items.redLaserGun.damage);
    console.log(`player.currentDamage: ${player.currentDamage}`);
}

const calculatePlayerCrit = () => {
    player.critChance = (
        0.01 * ship.critChance.multiplier
    ).toFixed(4);

    console.log(`critChance: ${player.critChance}`);
}

const calculateCritChance = () => {
    let random = Math.random();

    if (random <= player.critChance) {
        return isCritical = true;
    } else {
        return isCritical = false;
    }
}

const calculateCritDamage = () => {
    let dmg = 5 * player.currentDamage;
    crit = dmg;
    console.log(`critical! ${dmg}`);
    return dmg;
}

const dpsPlanet = () => {
    if (ship.dps.level >= 1) {
        planet.currentHp -= Math.ceil(player.currentDamage * (ship.dps.multiplier));
        player.totalDamage += Math.ceil(player.currentDamage * (ship.dps.multiplier));

        console.log(`dps damage`);

        if (planet.currentHp <= 0) {
            calculatePlanet();
            earnGold();
            reset = true;
            if (advance) advancePlanet();
        } else {
            reset = false;
        }
    }
}

let interval = setInterval(() => {
    dpsPlanet();
}, 1000);

const hitPlanet = () => {
    calculateCritChance();
    if (isCritical == true) {
        planet.currentHp -= calculateCritDamage();
        player.totalDamage += calculateCritDamage();
    } else if (isCritical == false) {
        planet.currentHp -= player.currentDamage;   
        player.totalDamage += player.currentDamage;
    }
    if (planet.currentHp <= 0) {
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
        
        if (planet.currentLevel > 1) {
            planet.currentLevel -= 1;
            calculatePlanet();
            planet.currentStage = stageCount;
            console.log(`arrowGold: ${planet.goldReward}`);

            db.query(arrowQuery, 
            [planet.currentLevel, planet.currentStage, planet.currentHp, planet.maxHp, userId], (err, data) => {
                if (err) throw err;
                console.log('%c levels updated', 'color: lightgreen');
            });
        } else if (planet.currentLevel == 1) {
            calculatePlanet();
            planet.currentStage = stageCount;
            db.query(arrowQuery, 
            [planet.currentLevel, planet.currentStage, planet.currentHp, planet.maxHp, userId], (err, data) => {
                if (err) throw err;
                console.log('%c levels updated', 'color: lightgreen');
            });
        }
    
}

const arrowRight = () => {
    advance = false;
    if (planet.currentLevel < planet.maxLevel && planet.currentLevel != planet.maxLevel) {
        planet.currentLevel += 1;
        calculatePlanet();
        planet.currentStage = stageCount;

        if (planet.currentLevel === planet.maxLevel) {
            advance = true;
            planet.currentStage = planet.maxStage;
            console.log(`arrowRight currentStage: ${planet.currentStage}`);
        }

        db.query(arrowQuery, 
        [planet.currentLevel, planet.currentStage, planet.currentHp, planet.maxHp, userId], (err, data) => {
            if (err) throw err;
            //console.log('%c levels updated', 'color: lightgreen');
        });
    } else if (planet.currentLevel === planet.maxLevel) {
        advance = true;
        planet.currentStage = planet.maxStage;
        console.log(`arrowRight currentStage: ${planet.currentStage}`);

        db.query(arrowQuery, 
        [planet.currentLevel, planet.currentStage, planet.currentHp, planet.maxHp, userId], (err, data) => {
            if (err) throw err;
            //console.log('%c levels updated', 'color: lightgreen');
        });
    }
}

const buyItem = (name, id) => {
    if (player.gold >= gameState['items'][name]['cost']) {
        player.gold -= gameState['items'][name]['cost'];
        gameState['items'][name]['level'] += 1;
        gameState['items'][name]['cost'] = Math.floor((gameState['items'][name]['baseCost']) * 1.05**(gameState['items'][name]['level']));
        gameState['items'][name]['damage'] = Math.floor(gameState['items'][name]['damage'] + (gameState['items'][name]['baseDamage'] * 1.05**gameState['items'][name]['level']));
        calculateCurrentDamage();
        console.log(gameState['items'][name]);

        db.query(itemQuery, 
        [
            gameState['items'][name]['level'], 
            gameState['items'][name]['cost'], 
            gameState['items'][name]['damage'], 
            player.currentDamage,
            userId,
            id
        ],
            (err, data) => {
                if (err) throw err;
            });
        }
}

const buyShip = (name, id) => {
    if (player.gold >= gameState['ship'][name]['cost']) {
        player.gold -= gameState['ship'][name]['cost'];
        gameState['ship'][name]['level'] += 1;
        gameState['ship'][name]['cost'] = Math.floor((gameState['ship'][name]['baseCost']) * 1.05**(gameState['ship'][name]['level']));
        if (name == 'dps') gameState['ship'][name]['multiplier'] = (((0.02 * gameState['ship'][name]['level'])) + 0.01).toFixed(2);
        else if (name == 'critChance') gameState['ship'][name]['multiplier'] = (1 + (gameState['ship'][name]['level'] * 0.1)).toFixed(1);
        else gameState['ship'][name]['multiplier'] = (1 + (gameState['ship'][name]['level'] * 0.02)).toFixed(2);

        calculateCurrentDamage();
        calculatePlayerCrit();
        console.log(gameState['ship'][name]);

        db.query(shipQuery, 
        [
            gameState['ship'][name]['level'], 
            gameState['ship'][name]['cost'], 
            gameState['ship'][name]['multiplier'], 
            player.currentDamage,
            userId,
            id
        ],
            (err, data) => {
                if (err) throw err;
            });
        }
}

const setDiamonds = () => {
    player.diamonds += 1;
    db.query(diamondsQuery, [player.diamonds, userId], (err, data) => {
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
    if (!isNaN(g) && g >= 0) {
        console.log(`is a number ${g}`);
        player.gold = g;

        db.query('UPDATE game JOIN users ON game.user_id = users.id SET gold = ? WHERE users.id = ?', [g, userId], (err, data) => {
            if (err) throw err;
        });
    }
}

const setAdminDiamonds = (d) => {
    if (!isNaN(d) && d >= 0) {
        player.diamonds = d;

        db.query('UPDATE game JOIN users ON game.user_id = users.id SET diamonds = ? WHERE users.id = ?', [d, userId], (err, data) => {
            if (err) throw err;
        });
    }
}

const setAdminLevel = (l) => {
    if (!isNaN(l) && l >= 1) {
        planet.currentLevel = l;
        if (planet.maxLevel < planet.currentLevel) planet.maxLevel = planet.currentLevel;

        calculatePlanet();
        console.log(player.gold);

        db.query('UPDATE game JOIN users ON game.user_id = users.id SET currentlevel = ?, maxlevel = ?, currentstage = ?, maxstage = ?, currenthp = ?, maxhp = ? WHERE users.id = ?', 
        [
            planet.currentLevel, 
            planet.maxLevel, 
            planet.currentStage, 
            planet.maxStage, 
            planet.currentHp, 
            planet.maxHp, 
            userId
        ], (err, data) => {
            if (err) throw err;
            console.log(userId);
        });
    }
}

const setAdminStage = (s) => {
    if (s > 10 || s < 0) {
        return;
    } else if (!isNaN(s)) {
        planet.currentStage = s;
        if (planet.maxLevel === planet.currentLevel) planet.maxStage = planet.currentStage;
        if (planet.currentLevel % 10 === 0) {
            stageCount = 1;
        } else {
            stageCount = 10;
        }
    }

    db.query('UPDATE game JOIN users ON game.user_id = users.id SET currentstage = ?, maxstage = ? WHERE users.id = ?', 
    [s, planet.maxStage, userId], (err, data) => {
        if (err) throw err;
    });
}

const setAdminCrit = (c) => {
    if (c < 1 && c >= 0) player.critChance = c;
    else return;

    console.log(`c: ${c}`);

    db.query(`UPDATE game JOIN users ON game.user_id = users.id SET critchance = ? WHERE users.id = ?`, 
    [c, userId], (err, data) => {
        if (err) throw err;
        console.log(data);
        console.log(`adminCrit userId: ${userId}`);
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
                    
                    socket.to(guildId).emit('receivechat', {currentHp: planet.currentHp});
                });
            }) */

            socket.on('senddps', () => {

                socket.emit('receivesenddps', {gameState: gameState});
            })

            socket.on('sendclick', () => {
                hitPlanet();
                socket.emit('receiveclick', {gameState: gameState, reset: reset, isCritical: isCritical, crit: crit});
            });

            socket.on('arrowleft', () => {
                console.log('arrowleft currentLevel: ' + planet.currentLevel);
                console.log('arrowleft maxHp: ' + planet.maxHp);
                arrowLeft();
                socket.emit('receivearrowleft', {gameState: gameState});
                console.log('arrowleft maxLevel: ' + planet.maxLevel);
                
                console.log('arrowleft currentLevel after emit: ' + planet.currentLevel);
                console.log('arrowleft maxHp after emit: ' + planet.maxHp);
            });

            socket.on('arrowright', () => {
                arrowRight();
                console.log('arrowright');
                //console.log(planet.currentHp);
                console.log('arrowright currentLevel: ' + planet.currentLevel);
                console.log('arrowright maxLevel: ' + planet.maxLevel);
                socket.emit('receivearrowright', {gameState: gameState});
            });

            socket.on('buyitem', (data) => {
                console.log(`buyitem data: ${data.id}`);

                buyItem(data.name, data.id);

                socket.emit('receivebuyitem', {gameState: gameState, name: data.name});
            });

            socket.on('buyship', (data) => {


                buyShip(data.name, data.id);

                socket.emit('receivebuyship', {gameState: gameState, name: data.name});
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
