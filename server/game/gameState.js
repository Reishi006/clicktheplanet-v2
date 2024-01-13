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

let arrowQuery = 'UPDATE game JOIN users ON game.id = users.game_id SET currentlevel = ?, currentstage = ?, currenthp = ?, maxHp = ? WHERE users.id = ?';

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

        db.query('UPDATE game JOIN users ON game.id = users.game_id SET currentlevel = ?, maxlevel = ?, currentstage = ?, maxstage = ?, currenthp = ?, maxhp = ? WHERE users.id = ?', 
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
        db.query('UPDATE game JOIN users ON game.id = users.game_id SET currentstage = ?, maxstage = ? WHERE users.id = ?', 
        [gameState.planet.currentStage, gameState.planet.maxStage, userId], (err, data) => {
            if (err) throw err;
            console.log('%c stage updated', 'color: lightblue');
        });
    }
}

const hitPlanet = () => {
    gameState.planet.currentHp -= gameState.player.currentDamage;
    if (gameState.planet.currentHp <= 0) {
        calculatePlanet();
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
        /* console.log('mess:', mess);
        console.log('uid:', uid);
        console.log('data:', data);
        console.log(`messageData.id ${messageData.id}`) */
        socket.emit('receiveinputsubmit', {
            id: messageData.id,
            login: messageData.login,
            message: messageData.message,
            date_sent: messageData.date_sent
        });
        //console.log(`messageData: ${messageData.login}`);
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
            calculatePlanet();
            socket.emit('receiveload', {gameState: gameState});


            socket.on('load', (data) => {
                calculatePlanet();
                console.log(`load data: ${data}`);
                socket.emit('receiveload', {gameState: gameState})
            });

            socket.on('sendclick', () => {
                hitPlanet();
                socket.emit('receiveclick', {gameState: gameState, reset: reset});
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

            socket.on('inputsubmit', (input) => {

                /* ===== TO BE FIXED ===== */
                
                getMessage(input, userId, socket);
                console.log(`input: ${input}`);
                //socket.emit('receiveinputsubmit', getMessage(input, userId));
            });
        });

        return io;
    }
}
